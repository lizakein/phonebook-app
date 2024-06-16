const { db } = require('../database');

const createUser = (email, hashedPassword, callback) => {
	const stmt = db.prepare('INSERT INTO users (email, password, isBlocked) VALUES (?, ?, ?)');
	stmt.run(email, hashedPassword, 0, function(err) {
		callback(err, this.lastID);
	});
	stmt.finalize();
};

const getUserByEmail = (email, callback) => {
	db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
		callback(err, row);
	});
};

const getUserById = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
};

const getAllUsers = (callback) => {
  db.all('SELECT * FROM users', (err, rows) => {
    callback(err, rows);
  });
};

const getUsersByBlockStatus = (blocked, callback) => {
  db.all('SELECT * FROM users WHERE isBlocked = ?', [blocked], (err, rows) => {
    callback(err, rows);
  });
};

const updateEmail = (id, newEmail, callback) => {
  const stmt = db.prepare('UPDATE users SET email = ? WHERE id = ?');
  stmt.run(newEmail, id, (err) => {
    callback(err);
  });
  stmt.finalize();
};

const updatePassword = (id, newPassword, callback) => {
  const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
  stmt.run(newPassword, id, (err) => {
    callback(err);
  });
  stmt.finalize();
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

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err || !row) 
      return callback(err || new Error('Пользователь не найден'));

    const userId = row.id;

    const stmt = db.prepare(`
      UPDATE users
      SET fullName = ?, birthdate = ?, hideYear = ?, workPhone = ?, personalPhones = ?, department = ?, position = ?, office = ?, about = ?, photo = ?
      WHERE email = ?
    `);
    stmt.run(
      fullName, birthdate, hideYear, workPhone, JSON.stringify(personalPhones), department, position, office, about, photo, email,
      function(err) {
        callback(err, { id: userId });
      }
    );
    stmt.finalize();
  });
};

const updateUserBlockStatus = (id, isBlocked, callback) => {
  const stmt = db.prepare('UPDATE users SET isBlocked = ? WHERE id = ?');
  stmt.run(isBlocked, id, (err) => {
    callback(err);
  });
  stmt.finalize();
};

module.exports = {
	createUser,
	getUserByEmail,
  getUserById,
  getAllUsers,
	updateUserInfo,
  updateEmail,
  updatePassword,
  updateUserBlockStatus,
  getUsersByBlockStatus
};
