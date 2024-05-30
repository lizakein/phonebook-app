const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.js');

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

module.exports = {
  authenticateToken
};