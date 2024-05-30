const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
const db = require('./database');

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

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

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка сервера' });
    if (row)
      return res.status(409).send({ message: 'Этот email уже занят' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    stmt.run(email, hashedPassword, function(err) {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });

      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).send({ id: this.lastID, token });
    });
    stmt.finalize();
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare('SELECT id, password FROM users WHERE email = ?');
    stmt.get(email, async (err, row) => {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
      if (!row || !(await bcrypt.compare(password, row.password))) 
        return res.status(401).send({ message: 'Неправильный логин и/или пароль' });   

      const token = jwt.sign({ id: row.id, email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).send({ id: row.id, token });
    });
    stmt.finalize();
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Неверный токен');
    req.user = user;
    next();
  });
};

app.post('/user-info', authenticateToken, upload.single('photo'), (req, res) => {
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