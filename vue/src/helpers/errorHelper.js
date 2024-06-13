import { ACCESS_ERRORS, AUTH_ERRORS, PARSING_ERRORS, SERVER_ERRORS, USER_ERRORS, VALIDATION_ERRORS } from "@/constants/messages";

const ERROR_CATEGORIES = {
  ACCESS: ACCESS_ERRORS,
  AUTH: AUTH_ERRORS,
  SERVER: SERVER_ERRORS,
  USER: USER_ERRORS,
  VALIDATION: VALIDATION_ERRORS,
  PARSING: PARSING_ERRORS
}

const errorHelper = {
  error(category, key) {
    const categoryErrors = ERROR_CATEGORIES[category];
    return categoryErrors ? categoryErrors[key] || 'Неизвестная ошибка' : 'Неизвестная категория ошибок';
  }
};

export default errorHelper;
