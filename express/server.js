const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Обработчик маршрута для главной страницы
app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

// Начало прослушивания сервера на указанном порту
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});