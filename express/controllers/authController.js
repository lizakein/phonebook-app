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

    userModel.createUser(email, hashedPassword, (err, userId) => {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
  
      const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).send({ id: userId, token });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, async (err, row) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка сервера' });
    if (!row || !(await bcrypt.compare(password, row.password))) 
      return res.status(401).send({ message: 'Неправильный логин и/или пароль' });   

    const token = jwt.sign({ id: row.id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ id: row.id, token });
  });
};

module.exports = {
  register,
  login
};
