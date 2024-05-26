const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Настройка конфигурации для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.post('/login', (req, res) => {
  const { action, email, password } = req.body;

  if (action === 'register') {
    db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
      if (row)
        return res.status(409).send({ message: 'Этот email уже занят' });
  
      const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
      stmt.run(email, password, function(err) {
        if (err) 
          return res.status(500).send({ message: 'Ошибка сервера' });
        res.status(201).send({ id: this.lastID });
      });
      stmt.finalize();
    })
  } else if (action === 'login') {
    const stmt = db.prepare('SELECT id FROM users WHERE email = ? AND password = ?');
    stmt.get(email, password, (err, row) => {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
      if (!row) 
        return res.status(401).send({ message: 'Неправильный логин и/или пароль' });   
      res.status(200).send({ id: row.id });
    });
    stmt.finalize();
  } else {
    res.status(400).send({ message: 'Некорректное действие' });
  }
});

app.post('/user-info', upload.single('photo'), (req, res) => {
  const {
    email,
    fullName,
    birthdate,
    hideYear, 
    workPhone,
    personalPhones,
    department,
    position,
    office,
    about
  } = req.body;
  const photo = req.file ? req.file.path: '';

  const stmt = db.prepare(`
    UPDATE users
    SET fullName = ?, birthdate = ?, hideYear = ?, workPhone = ?, personalPhones = ?, department = ?, position = ?, office = ?, about = ?, photo = ?
    WHERE email = ?
  `);
  stmt.run(
    fullName, birthdate, hideYear ? 1 : 0, workPhone, JSON.stringify(personalPhones), department, position, office, about, photo, email,
    function(err) {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
      res.status(200).send({ changes: this.changes });
    }
  );
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});