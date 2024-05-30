const multer = require('multer');

// Настройка конфигурации для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const upload = multer({ storage });

  module.exports = upload;