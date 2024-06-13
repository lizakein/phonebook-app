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
import { ADMIN_ENDPONTS } from '@/constants/api';
import errorHelper from '@/helpers/errorHelper';
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
        const response = await axios.post(ADMIN_ENDPONTS.LOGIN, {
          email,
          password
        });
        
        const token = response.data.token;
        localStorage.setItem('token', token);  
        
        this.$router.push({ path: '/users'});    
      } catch (error) {
        if (error.response.status === 401)
          this.errorMessage = errorHelper.error('AUTH', 'INVALID_LOGIN');
        else
          this.errorMessage = errorHelper.error('SERVER', 'SERVER_ERROR');
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
