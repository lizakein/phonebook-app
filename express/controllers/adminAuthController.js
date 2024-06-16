const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.js');
const adminModel = require('../models/adminModel');

const adminLogin = (req, res) => {
  const { email, password } = req.body;

  adminModel.getAdminByEmail(email, async (err, row) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка сервера' });
    if (!row || !(await bcrypt.compare(password, row.password))) 
      return res.status(401).send({ message: 'Неправильный логин и/или пароль' });   

    const token = jwt.sign({ id: row.id, email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ id: row.id, token });
  });
};

module.exports = {
  adminLogin
};
