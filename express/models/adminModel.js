const { db_admins } = require('../database');

const getAdminByEmail = (email, callback) => {
	db_admins.get('SELECT * FROM admins WHERE email = ?', [email], (err, row) => {
		callback(err, row);
	});
};

module.exports = {
  getAdminByEmail
};
