<template>
  <div v-if="user" class="user-form">
    <form @submit.prevent="handleSave">
      <p class="hint">* – обязательное поле</p>
      <div class="form-group">
        <label for="fullName">ФИО*</label>
        <input v-model="user.fullName" type="text" id="fullName" required>
        <p v-if="fullNameError" class="error-message">{{ fullNameError }}</p>
      </div>
      <div class="form-group">
        <label for="birthdate">Дата рождения*</label>
        <input v-model="user.birthdate" type="date" id="birthdate" required>
        <p v-if="birthdateError" class="error-message">{{ birthdateError }}</p>
        <div class="checkbox-group">
          <input v-model="user.hideYear" type="checkbox" id="hideYear">
          <label for="hideYear" class="checkbox-label">Скрыть год</label>
        </div>
      </div>
      <div class="form-group">
        <label for="workPhone">Рабочий телефон*</label>
        <input v-model="user.workPhone" type="tel" id="workPhone" required>
        <p v-if="workPhoneError" class="error-message">{{ workPhoneError }}</p>
      </div>
      <div class="form-group">
        <label>Личный телефон</label>         
        <div 
          v-for="(phone, index) in user.personalPhones" 
          :key="index" 
          class="phone-group"
        >         
          <div class="input-wrapper">
            <input v-model="phone.number" @input="validatePersonalPhone(index)" type="tel">
            <div class="checkbox-group">
              <input v-model="user.personalPhones[index].hide" type="checkbox">
              <label class="checkbox-label">Скрыть</label>
            </div>
            <button 
              type="button" 
              class="remove-btn" 
              @click="removePhone(index)"
            >
              Удалить
            </button>
          </div>
          <p v-if="phone.error" class="error-message">{{ phone.error }}</p>
        </div>
        <button type="button" @click="addPhone">Добавить телефон</button>
      </div>
      <div class="form-group">
        <label for="department">Отдел</label>
        <input v-model="user.department" type="text" id="department">
        <p v-if="departmentError" class="error-message">{{ departmentError }}</p>
      </div>
      <div class="form-group">
        <label for="position">Должность</label>
        <input v-model="user.position" type="text" id="position">
        <p v-if="positionError" class="error-message">{{ positionError }}</p>
      </div>
      <div class="form-group">
        <label for="office">Рабочее место (адрес офиса, кабинет)</label>
        <input v-model="user.office" type="text" id="office">
      </div>
      <div class="form-group">
        <label for="about">О себе</label>
        <textarea v-model="user.about" id="about" class="about-textarea"></textarea>
      </div>
      <div class="form-group">
        <label for="photo">Фото</label>
        <input type="file" id="photo" @change="handleFileUpload">
      </div>
      <button type="submit">Сохранить данные</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserForm',
  props: {
    userData: {
      type: Object,
      default: () => ({
        fullName: '',
        birthdate: '',
        hideYear: false,
        workPhone: '',
        personalPhones: [{ number: '', hide: false, error: '' }],
        department: '',
        position: '',
        office: '',
        about: '',
        photo: null
      })
    }
  },
  data() {
    return {
      user: null,
      fullNameError: '',
      birthdateError: '',
      workPhoneError: '',
      departmentError: '',
      positionError: '',
      errorMessage: ''
    };
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        this.user = { ...newValue };
        if (!this.user.personalPhones || !this.user.personalPhones.length)
          this.user.personalPhones = [{ number: '', hide: false, error: '' }];
      },
      deep: true
    },
    'user.fullName': function (value) {
      this.fullNameError = this.validateText(value) ? '' : (value ? 'Некорректное ФИО' : 'Поле обязательное');
    },
    'user.birthdate': function (value) {
      this.birthdateError = this.validateBirthdate(value) ? '' : (value ? 'Некорректная дата рождения' : 'Поле обязательное');
    },
    'user.workPhone': function (value) {
      this.workPhoneError = this.validatePhone(value) ? '' : (value ? 'Некорректный номер телефона' : 'Поле обязательное');
    },
    'user.department': function (value) {
      this.departmentError = this.validateText(value) ? '' : (value ? 'Некорректный отдел' : '');
    },
    'user.position': function (value) {
      this.positionError = this.validateText(value) ? '' : (value ? 'Некорректная должность' : '');
    }
  },
  methods: {
    addPhone() {
      this.user.personalPhones.push({ number: '', hide: false, error: '' });
    },
    removePhone(index) {
      this.user.personalPhones.splice(index, 1);
    },
    handleFileUpload(event) {
      this.user.photo = event.target.files[0];
    },
    async handleSave() {
      try {
        if (!this.validateForm()) {
          this.errorMessage = 'Введены некорректные данные';
          return;
        }

        this.errorMessage = '';      

        this.$emit('save', { ...this.user });

      } catch (error) {
        this.errorMessage = 'Ошибка сервера';
        console.error(error);
      }
    },
    validateForm() {
      return (
        this.validateText(this.user.fullName) &&
        this.validateBirthdate(this.user.birthdate) && 
        this.validatePhone(this.user.workPhone) && 
        this.validateAllPersonalPhones() &&
        this.validateText(this.user.department) &&
        this.validateText(this.user.position)
      );
    },
    validateBirthdate() {
      const today = new Date();
      const birthDate = new Date(this.user.birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      
      if (month < 0 || (month === 0 && today.getDate < birthDate.getDate()))
        age--;

      return age >= 18 && birthDate.getFullYear() >= 1900;
    },
    validatePhone(phone) {
      const re = /^\+\d{11}$/;
      return re.test(phone.trim());
    },
    validatePersonalPhone(index) {
      const phone = this.user.personalPhones[index].number;
      this.user.personalPhones[index].error = this.validatePhone(phone) || phone === '' ? '' : 'Некорректный номер телефона';
    },
    validateAllPersonalPhones() {
      return this.user.personalPhones.every(phone => this.validatePhone(phone.number) || phone.number === '');
    },
    validateText(text) {
      if (!text) return true;
      const re = /^\D+$/;
      return re.test(text.trim());
    }
  }
};
</script>

<style scoped>
.hint {
  font-size: 14px;
  color: gray;
  display: flex;
  justify-content: left;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.checkbox-group input[type="checkbox"] {
  margin-left: 10px;
  width: 13px;
}

.checkbox-label {
  margin: 0;
}

.phone-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.phone-group input {
  flex: 1;
}

.phone-group button {
  margin-left: 10px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.input-wrapper input {
  flex: 1;
}

.input-wrapper button {
  margin-left: 10px;
}

.remove-btn {
  background-color: #ff4d4f;
}

.about-textarea {
  max-width: calc(100% - 20px); 
  min-width: calc(100% - 20px); 
  min-height: 100px;
}

.error-message {
  color: red;
  margin-top: 5px;
}
</style>
