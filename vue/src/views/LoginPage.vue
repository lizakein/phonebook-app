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
          :class="{ 'active': formMode === 'Зарегестрироваться' }" 
          class="tabs-button" 
          @click="switchToRegister"
        >
          Зарегестрироваться
        </button>
      </div>
      <div class="form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input v-model="password" type="password" id="password" required>
          </div>
          <div v-if="formMode === 'Зарегестрироваться'" class="form-group">
            <label for="confirmPassword">Подтвердите пароль</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" required>
          </div>
          <button type="submit">{{ formMode }}</button>
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
      confirmPassword: ''
    };
  },
  methods: {
    switchToLogin() {
      this.formMode = 'Войти';
    },
    switchToRegister() {
      this.formMode = 'Зарегестрироваться';
    },
    async handleSubmit() {
      if (this.formMode === 'Войти') {
        console.log('Вход с:', this.email, this.password);
      } else {
        if (this.validateForm()) {
          try {
            await axios.post('http://localhost:3000/login', { //!
              email: this.email,
              password: this.password
            });
            this.$router.push({ path: '/user-info', query: { email: this.email }});
          } catch (error) {
            if (error.response) {
              console.error('Response error:', error.response.data); 
            } else if (error.request) {
              console.error('Request error:', error.request); 
            } else {
              console.error('General error:', error.message);
            }
          }   
        }
        else {
          alert('Пароли не совпадают'); // Заменить потом
        }
      }
    },
    validateForm() {
      let isValid = true;
      if (!this.validateEmail(this.email)) {
        this.emailError = 'Некорректный email';
        isValid = false;
      }
      if (this.password.length < 8) {
        this.passwordError = 'Пароль должен быть не менее 8 символов';
        isValid = false;
      }
      if (this.formMode === 'Зарегистрироваться' && this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Пароли не совпадают';
        isValid = false;
      }
      return isValid;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
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
</style>
