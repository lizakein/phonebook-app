<template>
  <div class="login-page">
    <div class="container">
      <div class="tabs">
        <button 
          :class="{ 'active': formMode === 'login' }" 
          class="tabs-button" 
          @click="switchToLogin"
        >
          Войти
        </button>
        <button 
          :class="{ 'active': formMode === 'register' }" 
          class="tabs-button" 
          @click="switchToRegister"
        >
          Зарегистрироваться
        </button>
      </div>
      <div class="form">
        <EmailPasswordForm
          :formMode="formMode"
          @submit="handleFormSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EmailPasswordForm from '@/components/EmailPasswordForm.vue';

export default {
  name: 'LoginPage',
  components: {
    EmailPasswordForm
  },
  data() {
    return {
      formMode: 'login',
    };
  },
  computed: {
    buttonLabel() {
      return this.formMode === 'login' ? 'Войти' : "Зарегистрироваться";
    }
  },
  methods: {
    switchToLogin() {
      this.formMode = 'login';
    },
    switchToRegister() {
      this.formMode = 'register';
    },
    clearErrors() {
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
    },
    async handleFormSubmit({ email, password, confirmPassword }) {
      try {
        let response;
        if(this.formMode === 'login') {
          response = await axios.post('http://localhost:3000/auth/login', {
            email,
            password
          });
        } else {
          response = await axios.post('http://localhost:3000/auth/register', {
            email,
            password,
            confirmPassword
          });
        }

        const token = response.data.token;
        localStorage.setItem('token', token);  
        
        if (this.formMode === 'login') 
          this.$router.push({ path: `/profile/${response.data.id}`});
        else 
          this.$router.push({ path: '/user-info', query: { email }});       
      } catch (error) {
        if (error.response && error.response.status === 409) 
          this.errorMessage = 'Этот email уже занят';
        else if (error.response && error.response.status === 401)
          this.errorMessage = 'Неправильный логин и/или пароль';
        else
          this.errorMessage = 'Ошибка сервера';
      }
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
