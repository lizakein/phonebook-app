const { db_requests } = require('../database');
const userModel = require('./userModel');

const createAccessRequest = (requesterId, ownerId, callback) => {
  db_requests.get('SELECT * FROM access_requests WHERE requester_id = ? AND owner_id = ?', [requesterId, ownerId], (err, row) => {
    if (err) return callback(err);
    if (row) return callback(null, { message: 'Запрос уже существует' });
  });

  db_requests.run('INSERT INTO access_requests (requester_id, owner_id) VALUES (?, ?)', [requesterId, ownerId], function (err) {
    callback(err, this.lastID);
  });
};

const getAccessRequestsByUserId = (userId, callback) => {
  db_requests.all('SELECT * FROM access_requests WHERE  owner_id = ?', [userId], async (err, rows) => {
    if (err) return callback(err);

    const requestsWithUserInfo = await Promise.all(rows.map(async (request) => {
      return new Promise((resolve, reject) => {
        userModel.getUserById(request.requester_id, (err, user) => {
          if (err) return reject(err);
          resolve({ ...request, fullName: user.fullName });
        });
      });
    }));

    callback(null, requestsWithUserInfo);
  });
};

const updateAccessRequestStatus = (requestId, status, callback) => {
  db_requests.run('UPDATE access_requests SET status = ? WHERE id = ?', [status, requestId], function (err) {
    callback(err);
  });
};

const checkAccessRequest = (requesterId, ownerId, callback) => {
  db_requests.get('SELECT * FROM access_requests WHERE requester_id = ? AND owner_id = ?', [requesterId, ownerId], (err, row) => {
    if (err) return callback(err);
    callback(null, !!row);
  });
};

module.exports = {
  createAccessRequest,
  getAccessRequestsByUserId,
  updateAccessRequestStatus,
  checkAccessRequest
};