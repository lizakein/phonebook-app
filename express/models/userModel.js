const db = require('../database');

const createUser = (email, hashedPassword, callback) => {
	const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
	stmt.run(email, hashedPassword, function(err) {
		callback(err, this.lastID);
	});
	stmt.finalize();
};

const getUserByEmail = (email, callback) => {
	db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
		callback(err, row);
	});
};

const updateUserInfo = (email, userData, callback) => {
  const {
    fullName,
    birthdate,
    hideYear, 
    workPhone,
    personalPhones,
    department,
    position,
    office,
    about,
		photo
  } = userData;

  const stmt = db.prepare(`
    UPDATE users
    SET fullName = ?, birthdate = ?, hideYear = ?, workPhone = ?, personalPhones = ?, department = ?, position = ?, office = ?, about = ?, photo = ?
    WHERE email = ?
  `);
  stmt.run(
    fullName, birthdate, hideYear ? 1 : 0, workPhone, JSON.stringify(personalPhones), department, position, office, about, photo, email,
    function(err) {
      callback(err, this.changes);
    }
  );
  stmt.finalize();
};

module.exports = {
	createUser,
	getUserByEmail,
	updateUserInfo
};