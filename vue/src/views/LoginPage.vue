<template>
  <div class="login-page">
    <div class="container">
      <div class="tabs">
        <button 
          :class="{ 'active': formMode === 'Войти' }" 
          class="tabs-button" 
          @click="switchToLogin"
        >
          Войти
        </button>
        <button 
          :class="{ 'active': formMode === 'Зарегистрироваться' }" 
          class="tabs-button" 
          @click="switchToRegister"
        >
          Зарегистрироваться
        </button>
      </div>
      <div class="form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" required>
            <p v-if="emailError" class="error-message">{{ emailError }}</p>
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input v-model="password" type="password" id="password" required>
            <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
          </div>
          <div v-if="formMode === 'Зарегистрироваться'" class="form-group">
            <label for="confirmPassword">Подтвердите пароль</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" required>
            <p v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</p>
          </div>
          <button type="submit">{{ formMode }}</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formMode: 'Войти',
      email: '',
      password: '',
      confirmPassword: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      errorMessage: ''
    };
  },
  watch: {
    email(value) {
      this.emailError = this.validateEmail(value) ? '' : 'Некорректный email';
    },
    password(value) {
      if (this.formMode === 'Зарегистрироваться') 
        this.passwordError = this.validatePassword(value) ? '' : 'Пароль должен быть не менее 8 символов, содержать буквы, цифры и спецсимволы';
      else 
        this.passwordError = '';
    },
    confirmPassword(value) {
      this.confirmPasswordError = value === this.password ? '' : 'Пароли не совпадают';
    }
  },
  methods: {
    switchToLogin() {
      this.formMode = 'Войти';
      this.errorMessage = '';
      this.clearErrors();
    },
    switchToRegister() {
      this.formMode = 'Зарегистрироваться';
      this.errorMessage = '';
      this.clearErrors();
    },
    clearErrors() {
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
    },
    async handleSubmit() {
      this.errorMessage = '';

      if (this.formMode === 'Зарегистрироваться' && !this.validateForm()) 
        return;

      try {
        let response;
        if(this.formMode === 'Войти') {
          response = await axios.post('http://localhost:3000/login', {
            email: this.email,
            password: this.password
          });
        } else {
          response = await axios.post('http://localhost:3000/register', {
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword
          });
        }

        const token = response.data.token;
        localStorage.setItem('token', token);  
        
        if (this.formMode === 'Войти') 
          this.$router.push({ path: `/profile/${response.data.id}`});
        else 
          this.$router.push({ path: '/user-info', query: { email: this.email }});       
      } catch (error) {
        if (error.response && error.response.status === 409) 
          this.errorMessage = 'Этот email уже занят';
        else if (error.response && error.response.status === 401)
          this.errorMessage = 'Неправильный логин и/или пароль';
        else
          this.errorMessage = 'Ошибка сервера ';
      }
    },
    validateForm() {
      const doPasswordMatch = this.password === this.confirmPassword;
      return this.validateEmail(this.email) && this.validatePassword(this.password) && doPasswordMatch;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    },
    validatePassword(password) {
      const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_.-])[A-Za-z\d@$!%*#?&_.-]{8,}$/;
      return re.test(password);
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #cddff3;
}

.container {
  width: 400px;
}

.tabs {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
