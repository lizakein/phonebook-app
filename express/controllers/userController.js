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
  const photo = req.file ? req.file.path : '';

  const userData = {
    fullName,
    birthdate,
    hideYear: hideYear ? 1 : 0, 
    workPhone,
    personalPhones,
    department,
    position,
    office,
    about,
    photo
  };

  userModel.updateUserInfo(email, userData, (err, changes) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка сервера '});
    res.status(200).send({ changes });
  });
};

module.exports = {
  updateUserInfo
};
