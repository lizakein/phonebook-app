<template>
  <div class="user-info-page">
    <div class="container">
      <h2 class="heading">Введите личные данные</h2>
      <form @submit.prevent="handleSave">
        <div class="form-group">
          <label for="fullName">ФИО</label>
          <input v-model="fullName" type="text" id="fullName" required>
        </div>
        <div class="form-group">
          <label for="birthdate">Дата рождения</label>
          <input v-model="birthdate" type="date" id="birthdate" required>
          <div class="checkbox-group">
            <input v-model="hideYear" type="checkbox" id="hideYear">
            <label for="hideYear" class="checkbox-label">Скрыть год</label>
          </div>
        </div>
        <div class="form-group">
          <label for="workPhone">Рабочий телефон</label>
          <input v-model="workPhone" type="tel" id="workPhone" required>
        </div>
        <div class="form-group">
          <label>Личный телефон</label>
          <div 
            v-for="(phone, index) in personalPhones" 
            :key="index" 
            class="phone-group"
          >
            <input v-model="personalPhones[index].number" type="tel">
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
          <button type="button" @click="addPhone">Добавить телефон</button>
        </div>
        <div class="form-group">
          <label for="department">Отдел</label>
          <input v-model="department" type="text" id="department">
        </div>
        <div class="form-group">
          <label for="position">Должность</label>
          <input v-model="position" type="text" id="position">
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
      </form>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      fullName: '',
      birthdate: '',
      hideYear: false,
      workPhone: '',
      personalPhones: [
        { number: '', hide: false }
      ],
      department: '',
      position: '',
      office: '',
      about: '',
      photo: null
    };
  },
  methods: {
    addPhone() {
      this.personalPhones.push({ number: '', hide: false });
    },
    removePhone(index) {
      this.personalPhones.splice(index, 1);
    },
    handleFileUpload(event) {
      this.photo = event.target.files[0];
    },
    handleSave() {
      // Заменить потом на отправку в БД
      console.log('Сохранение данных пользователя:', {
        fullName: this.fullName,
        birthdate: this.birthdate,
        hideYear: this.hideYear,
        workPhone: this.workPhone,
        personalPhones: this.personalPhones,
        department: this.department,
        position: this.position,
        office: this.office,
        about: this.about,
        photo: this.photo
      });
      this.$router.push('/profile'); // Добавить id(?)
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
  align-items: center;
  margin-bottom: 10px;
}

.phone-group input {
  flex: 1;
}

.remove-btn {
  background-color: #ff4d4f;
}

.phone-group button {
  margin-left: 10px;
}

.about-textarea {
  max-width: calc(100% - 20px); 
  min-width: calc(100% - 20px); 
  min-height: 100px;
}
</style>
  