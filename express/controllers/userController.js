const userModel = require('../models/userModel');

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
  getUserById
};
