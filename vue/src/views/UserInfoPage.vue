<template>
  <div class="user-info-page">
    <div class="container">
      <h2 class="heading">Введите личные данные</h2>
      <form @submit.prevent="handleSave">
        <p class="hint">* – обязательное поле</p>
        <div class="form-group">
          <label for="fullName">ФИО*</label>
          <input v-model="fullName" type="text" id="fullName" required>
          <p v-if="fullNameError" class="error-message">{{ fullNameError }}</p>
        </div>
        <div class="form-group">
          <label for="birthdate">Дата рождения*</label>
          <input v-model="birthdate" type="date" id="birthdate" required>
          <p v-if="birthdateError" class="error-message">{{ birthdateError }}</p>
          <div class="checkbox-group">
            <input v-model="hideYear" type="checkbox" id="hideYear">
            <label for="hideYear" class="checkbox-label">Скрыть год</label>
          </div>
        </div>
        <div class="form-group">
          <label for="workPhone">Рабочий телефон*</label>
          <input v-model="workPhone" type="tel" id="workPhone" required>
          <p v-if="workPhoneError" class="error-message">{{ workPhoneError }}</p>
        </div>
        <div class="form-group">
          <label>Личный телефон</label>         
          <div 
            v-for="(phone, index) in personalPhones" 
            :key="index" 
            class="phone-group"
          >         
            <div class="input-wrapper">
              <input v-model="phone.number" @input="validatePersonalPhone(index)" type="tel">
              <div class="checkbox-group">
                <input v-model="personalPhones[index].hide" type="checkbox">
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
          <input v-model="department" type="text" id="department">
          <p v-if="departmentError" class="error-message">{{ departmentError }}</p>
        </div>
        <div class="form-group">
          <label for="position">Должность</label>
          <input v-model="position" type="text" id="position">
          <p v-if="positionError" class="error-message">{{ positionError }}</p>
        </div>
        <div class="form-group">
          <label for="office">Рабочее место (адрес офиса, кабинет)</label>
          <input v-model="office" type="text" id="office">
        </div>
        <div class="form-group">
          <label for="about">О себе</label>
          <textarea v-model="about" id="about" class="about-textarea"></textarea>
        </div>
        <div class="form-group">
          <label for="photo">Фото</label>
          <input type="file" id="photo" @change="handleFileUpload">
        </div>
        <button type="submit">Сохранить данные</button>
        <p v-if="erorrMessage" class="error-message">{{ erorrMessage }}</p>
      </form>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      fullName: '',
      birthdate: '',
      hideYear: false,
      workPhone: '',
      personalPhones: [
        { number: '', hide: false, error: '' }
      ],
      department: '',
      position: '',
      office: '',
      about: '',
      photo: null,
      fullNameError: '',
      birthdateError: '',
      workPhoneError: '',
      departmentError: '',
      positionError: '',
      erorrMessage: ''
    };
  },
  watch: {
    fullName(value) {
      this.fullNameError = this.validateText(value) ? '' : (value ? 'Некорректное ФИО' : 'Поле обязательное');
    },
    birthdate(value) {
      this.birthdateError = this.validateBirthdate(value) ? '' : (value ? 'Некорректная дата рождения' : 'Поле обязательное');
    },
    workPhone(value) {
      this.workPhoneError = this.validatePhone(value) ? '' : (value ? 'Некорректный номер телефона' : 'Поле обязательное');
    },
    department(value) {
      this.departmentError = this.validateText(value) ? '' : (value ? 'Некорректный отдел' : '');
    },
    position(value) {
      this.positionError = this.validateText(value) ? '' : (value ? 'Некорректная должность' : '');
    }
  },
  methods: {
    addPhone() {
      this.personalPhones.push({ number: '', hide: false, error: '' });
    },
    removePhone(index) {
      this.personalPhones.splice(index, 1);
    },
    handleFileUpload(event) {
      this.photo = event.target.files[0];
    },
    async handleSave() {
      try {
        if (!this.validateForm()) {
          this.erorrMessage = 'Введены некорректные данные';
          return;
        }

        // Убираем все поля без телефонов перед сохранение в БД
        const filteredPhones = this.personalPhones
          .filter(phone => phone.number.trim() !== '')  
          .map(phone => ({ number: phone.number, hide: phone.hide }));
        
        const formData = new FormData();
        formData.append('email', this.$route.query.email);
        formData.append('fullName', this.fullName);
        formData.append('birthdate', this.birthdate);
        formData.append('hideYear', this.hideYear);
        formData.append('workPhone', this.workPhone);
        formData.append('personalPhones', JSON.stringify(filteredPhones));
        formData.append('department', this.department);
        formData.append('position', this.position);
        formData.append('office', this.office);
        formData.append('about', this.about);
        if (this.photo) {
          formData.append('photo', this.photo);
        }

        const token = localStorage.getItem('token');
        if (!token) {
          this.erorrMessage = 'Не удалось получить токен авторизации';
          return;
        }

        const response = await axios.post('http://localhost:3000/user/user-info', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) this.$router.push('/profile'); // Добавить id(?)
      } catch (error) {
        this.erorrMessage = 'Ошибка сервера';
      }
    },
    validateForm() {
      return (
        this.validateText(this.fullName) &&
        this.validateBirthdate(this.birthdate) && 
        this.validatePhone(this.workPhone) && 
        this.validateAllPersonalPhones() &&
        this.validateText(this.department) &&
        this.validateText(this.position)
      );
    },
    validateBirthdate() {
      const today = new Date();
      const birthDate = new Date(this.birthdate);
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
      const phone = this.personalPhones[index].number;
      this.personalPhones[index].error = this.validatePhone(phone) || phone === '' ? '' : 'Некорректный номер телефона';
    },
    validateAllPersonalPhones() {
      return this.personalPhones.every(phone => this.validatePhone(phone.number) || phone.number === '');
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
.user-info-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 600px;
}

.heading {
  text-decoration: underline #0464ca;
}

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