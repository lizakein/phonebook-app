const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const updateEmail = (req, res) => {
  const { newEmail } = req.body;
  const userId = req.user.role === 'admin' ? req.params.id : req.user.id;

  if (!newEmail) 
    return res.status(400).send({ message: 'Некорректный email' });

  userModel.getUserByEmail(newEmail, (err, user) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка сервера' });

    if (user) 
      return res.status(409).send({ message: 'Введенный email занят' });

    userModel.updateEmail(userId, newEmail, (err) => {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
      res.status(200).send({ message: 'Email обновлен' });
    });
  });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.role === 'admin' ? req.params.id : req.user.id;

  if (!newPassword) 
    return res.status(400).send({ message: 'Некорректный пароль' });

  userModel.getUserById(userId, async (err, user) => {
    if (err || !user) 
      return res.status(404).send({ message: 'Пользователь не найден' });

    if (req.user.role !== 'admin') {
      if (!oldPassword) 
        return res.status(400).send({ message: 'Старый пароль обязателен' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) 
        return res.status(409).send({ message: 'Старый пароль некорректен' });
    }    

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userModel.updatePassword(userId, hashedPassword, (err) => {
      if (err) 
        return res.status(500).send({ message: 'Ошибка сервера' });
      res.status(200).send({ message: 'Пароль обновлен' });
    });
  });
};

const updateUserInfo = (req, res) => {
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
  const photo = req.file ? req.file.path : 'uploads/default-photo.jpg';

  const hideYearBool = hideYear === 'true';

  const userData = {
    fullName,
    birthdate,
    hideYear: hideYearBool ? 1 : 0, 
    workPhone,
    personalPhones,
    department,
    position,
    office,
    about,
    photo
  };

  userModel.updateUserInfo(email, userData, (err, userId) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка сервера'});
    res.status(200).send({ id: userId.id });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user.id;

  userModel.getUserById(userId, (err, user) => {
    if (err || !user) 
      return res.status(404).send({ message: 'Пользователь не найден'});
    const isOwner = userId == currentUserId;
    res.status(200).send( {...user, isOwner});
  });
};

const getAllUsers = async (req, res) => {
  userModel.getAllUsers((err, users) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка сервера' });
    res.status(200).send(users);
  });
};

const getUsersByBlockStatus = (req, res) => {
  const { blocked } = req.query;
  userModel.getUsersByBlockStatus(blocked, (err, users) => {
    if (err) return res.status(500).send({ message: 'Ошибка сервера' });
    if (!users || users.length === 0)
      return res.status(404).send({ message: 'Пользователи не найдены' });
    res.status(200).send(users);
  });
};

const updateUserBlockStatus = (req, res) => {
  const userId = req.params.id;
  const { isBlocked } = req.body;

  userModel.updateUserBlockStatus(userId, isBlocked, (err) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка сервера' });
    res.status(200).send({ message: `Пользователь ${isBlocked ? 'заблокирован' : 'разблокирован'}` });
  });
};

module.exports = {
  updateUserInfo,
  getUserById,
  getAllUsers,
  updateEmail,
  updatePassword,
  updateUserBlockStatus,
  getUsersByBlockStatus
};
