const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('phonebook.db', (err) => {
	if (err) 
	  console.error('Ошибка подключения к базе данных телефонной книги:', err);
	 else 
	  console.log('Подключение к базе данных телефонной книги установлено');	
});

const db_requests = new sqlite3.Database('access_requests.db', (err) => {
	if (err) 
		console.error('Ошибка подключения к базе данных запросов:', err);
	else 
		console.log('Подключение к базе данных запросов установлено');	
});

const db_admins = new sqlite3.Database('admins.db', (err) => {
	if (err) 
		console.error('Ошибка подключения к базе данных админов:', err);
	else 
		console.log('Подключение к базе данных админов установлено');	
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

db_requests.serialize(() => {
	db_requests.run(`
		CREATE TABLE IF NOT EXISTS access_requests (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			requester_id INTEGER,
			owner_id INTEGER,
			status TEXT DEFAULT 'pending'
		)
	`);
});

db_admins.serialize(() => {
	db_admins.run(`
		CREATE TABLE IF NOT EXISTS admins (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL
		)
	`);
});

module.exports = {
	db,
	db_requests,
	db_admins
};
