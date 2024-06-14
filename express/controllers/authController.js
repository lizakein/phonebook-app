const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.js');
const userModel = require('../models/userModel.js');

const register = async (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, async (err, row) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка сервера' });
    if (row)
      return res.status(409).send({ message: 'Этот email уже занят' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email, hashedPassword }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, async (err, row) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка сервера' });

    if (!row || !(await bcrypt.compare(password, row.password))) 
      return res.status(401).send({ message: 'Неправильный логин и/или пароль' });

    if (row.isBlocked)
      return res.status(403).send({ message: 'Аккаунт заблокирован' });

    const token = jwt.sign({ id: row.id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ id: row.id, token });
  });
};

module.exports = {
  register,
  login
};
