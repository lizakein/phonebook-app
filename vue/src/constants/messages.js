export const ACCESS_ERRORS = {
  CHECK_REQUEST_ERROR: 'Ошибка при проверке существующего запроса',
  CHECK_STATUS_ERROR: 'Ошибка при проверке статуса запроса',
  SEND_REQUEST_ERROR: 'Ошибка отправки запроса на доступ',
  REQUEST_FETCH_ERROR: 'Ошибка получения запросов на доступ',
  STATUS_UPDATE_ERROR: 'Ошибка обновления статуса запроса',
  REQUEST_ACCEPT_ERROR: 'Ошибка при принятии запроса',
  REQUEST_REJECT_ERROR: 'Ошибка при отклонении запроса',
  HIDDEN_PHONE_CHECK_ERROR: 'Ошибка проверки скрытых номеров',
};

export const AUTH_ERRORS = {
  INVALID_LOGIN: 'Неправильный логин и/или пароль',
  ACCOUNT_BLOCKED: 'Ваш аккаунт заблокирован',
  EMAIL_ALREADY_TAKEN: 'Этот email уже занят',
};

export const SERVER_ERRORS = {
  SERVER_ERROR: 'Ошибка сервера',
};

export const USER_ERRORS = {
  USER_DATA_FETCH_ERROR: 'Ошибка получения пользовательских данных',
  TOKEN_USER_DATA_ERROR: 'Ошибка получения данных текущего пользователя из токена',
  DECODE_TOKEN_ERROR: 'Ошибка декодирования токена',
  GET_USER_LIST_ERROR: 'Ошибка получения списка пользователей',
};

export const VALIDATION_ERRORS = {
  REQUIRED_FIELD_ERROR: 'Поле обязательное',
  INVALID_DATA_ERROR: 'Введены некорректные данные',
  INVALID_NAME_ERROR: 'Некорректное ФИО',
  INVALID_BIRTHDATE_ERROR: 'Некорректная дата рождения',
  INVALID_PHONE_ERROR: 'Некорректный номер телефона',
  INVALID_DEPARTMENT_ERROR: 'Некорректный отдел',
  INVALID_POSITION_ERROR: 'Некорректная должность',
  INVALID_EMAIL_ERROR: 'Некорректный email',
  INVALID_PASSWORD_ERROR: 'Пароль должен быть не менее 8 символов, содержать буквы, цифры и спецсимволы',
  PASSWORDS_NOT_MATCH: 'Пароли не совпадают',
};

export const PARSING_ERRORS = {
  DATA_PARSING_ERROR: 'Ошибка парсинга данных',
};
