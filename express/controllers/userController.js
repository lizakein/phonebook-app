const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const updateEmail = (req, res) => {
  const { newEmail } = req.body;
  const userId = req.user.id;

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
  const userId = req.user.id;

  if (!oldPassword || !newPassword) 
    return res.status(400).send({ message: 'Некорректный пароль' });

  userModel.getUserById(userId, async (err, user) => {
    if (err || !user) 
      return res.status(404).send({ message: 'Пользователь не найден' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) 
      return res.status(409).send({ message: 'Старый пароль некорректен' });

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
      return res.status(500).send({ message: 'Ошибка сервера '});
    res.status(200).send({ id: userId.id });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  userModel.getUserById(userId, (err, user) => {
    if (err || !user) {
      return res.status(404).send({ message: 'Пользователь не найден'});
    }
    res.status(200).send(user);
  });
};

module.exports = {
  updateUserInfo,
  getUserById,
  updateEmail,
  updatePassword
};
