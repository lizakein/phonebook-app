<template>
  <div class="user-settings">
    <form @submit.prevent="handleSave">
      <div class="form-group">
        <label for="email">Новый email</label>
        <input v-model="newEmail" type="email" id="email">
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>
      <div class="form-group">
        <label for="oldPassword">Старый пароль</label>
        <input v-model="oldPassword" type="password" id="oldPassword">
      </div>
      <div class="form-group">
        <label for="newPassword">Новый пароль</label>
        <input v-model="newPassword" type="password" id="newPassword">
        <p v-if="newPasswordError" class="error-message">{{ newPasswordError }}</p>
      </div>
      <button type="submit">Сохранить изменения</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>
  
<script>
import errorHelper from '@/helpers/errorHelper';

export default {
  name: 'UserSettingsForm',
  data() {
    return {
      newEmail: '',
      oldPassword: '',
      newPassword: '',
      emailError: '',
      newPasswordError: '',
      errorMessage: ''
    };
  },
  watch: {
    newEmail(value) {
      this.emailError = this.validateEmail(value) ? '' : (value ? errorHelper.error('VALIDATION', 'INVALID_EMAIL_ERROR') : '');
    },
    newPassword(value) {
      this.newPasswordError = this.validatePassword(value) ? '' : (value ? errorHelper.error('VALIDATION', 'INVALID_PASSWORD_ERROR') : '');
    }
  },
  methods: {
    handleSave() {
      this.errorMessage = '';
      
      if (this.emailError || this.newPasswordError || this.errorMessage) 
        return;     
      
      this.$emit('save', { newEmail: this.newEmail, oldPassword: this.oldPassword, newPassword: this.newPassword });
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
