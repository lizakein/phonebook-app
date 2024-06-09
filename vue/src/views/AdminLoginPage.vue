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
      </div>
      <div class="form">
        <EmailPasswordForm
          :formMode="formMode"
          @submit="handleFormSubmit"
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EmailPasswordForm from '@/components/EmailPasswordForm.vue';

export default {
  name: 'AdminLoginPage',
  components: {
    EmailPasswordForm
  },
  data() {
    return {
      formMode: 'login',
      errorMessage: ''
    };
  },
  methods: {
    switchToLogin() {
      this.formMode = 'login';
      this.errorMessage = '';
    },
    async handleFormSubmit({ email, password }) {
      try {
        const response = await axios.post('http://localhost:3000/admin/login', {
          email,
          password
        });
        
        const token = response.data.token;
        localStorage.setItem('token', token);  
        
        this.$router.push({ path: '/users'});    
      } catch (error) {
        if (error.response.status === 401)
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
</style>
