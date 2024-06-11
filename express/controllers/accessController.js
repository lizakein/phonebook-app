const accessModel = require('../models/accessModel');

const createAccessRequest = (req, res) => {
  const { ownerId } = req.body;
  const requesterId = req.user.id;

  accessModel.createAccessRequest(requesterId, ownerId, (err, requestId) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка создания запроса' });
    if (res.message === 'Запрос уже существует')
      return res.status(400).send({ message: 'Запрос уже существует' });
    res.status(201).send({ requestId });
  });
};

const getAccessRequestsByUserId = (req, res) => {
  const userId = req.user.id;

  accessModel.getAccessRequestsByUserId(userId, (err, requests) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка получения запросов' });
    res.status(200).send({ requests });
  });
};

const updateAccessRequestStatus = (req, res) => {
  const { requestId } = req.params;
  const { status }= req.body;

  accessModel.updateAccessRequestStatus(requestId, status, (err) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка обновления статуса запроса' });
    res.status(200).send({ message: 'Статус запроса обновлен' });
  });
};

const checkAccessRequest = (req, res) => {
  const { requesterId, ownerId } = req.params;

  accessModel.checkAccessRequest(requesterId, ownerId, (err, exists) => {
    if (err) 
      return res.status(500).send({ message: 'Ошибка проверки существования запроса' });
    return res.status(200).send({ exists });
  });
};

const checkAccessRequestStatus = (req, res) => {
  const { requesterId, ownerId } = req.params;

  accessModel.checkAccessRequestStatus(requesterId, ownerId, (err, status) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка проверки статуса запроса' });
    if (status)
      return res.status(200).send({ status });
    else
      return res.status(404).send({ message: 'Запрос не найден' });
  })
}

module.exports = {
  createAccessRequest,
  getAccessRequestsByUserId,
  updateAccessRequestStatus,
  checkAccessRequest,
  checkAccessRequestStatus
};