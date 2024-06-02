<template>
  <div class="password-form">
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
      <div v-if="formMode === 'register'" class="form-group">
        <label for="confirmPassword">Подтвердите пароль</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" required>
        <p v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</p>
      </div>
      <button type="submit">{{ buttonLabel }}</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>
  
<script>
export default {
  name: 'EmailPasswordForm',
  props: {
    formMode: {
      type: String,
      default: 'login'
    }
  },
  data() {
    return {
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
      if (this.formMode === 'register') 
        this.passwordError = this.validatePassword(value) ? '' : 'Пароль должен быть не менее 8 символов, содержать буквы, цифры и спецсимволы';
      else 
        this.passwordError = '';
    },
    confirmPassword(value) {
      this.confirmPasswordError = value === this.password ? '' : 'Пароли не совпадают';
    }
  },
  computed: {
    buttonLabel() {
      return this.formMode === 'login' ? 'Войти' : "Зарегистрироваться";
    }
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = '';

      if (this.formMode === 'login' || this.validateForm()) {
        this.$emit('submit', {
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword
        });
      } else {
        this.errorMessage = 'Введены некорректные данные';
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
