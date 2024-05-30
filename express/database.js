const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('phonebook.db', (err) => {
	if (err) 
	  console.error('Ошибка подключения к базе данных:', err);
	 else 
	  console.log('Подключение к базе данных установлено');	
});

db.serialize(() => {
	db.run(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			fullName TEXT,
			birthdate TEXT,
			hideYear INTEGER,
			workPhone TEXT,
			personalPhones TEXT,
			department TEXT,
			position TEXT,
			office TEXT,
			about TEXT,
			photo TEXT
		)
	`);
});

module.exports = db; 
