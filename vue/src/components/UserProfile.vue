<template>
  <div class="user-profile">
    <div class="photo-section">
      <img v-if="user.photo" :src="getPhotoUrl(user.photo)" alt="Фото пользователя">
      <button class="button">Редактировать профиль</button>
    </div>
    <div class="info-section">
      <div class="full-name"> {{ user.fullName }}</div>
      <div v-for="(field, index) in fields" :key="index" class="info-row">
        <div class="info-label">{{ field.label }}</div>
        <div class="info-value">
          <span>{{ field.value }}</span>        
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { String } from 'core-js';

export default {
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: { ...this.userData },
      fields: []
    };
  },
  methods: {
    getPhotoUrl(photoPath) {
      return `http://localhost:3000/${photoPath.replace(/\\/g, '/')}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return this.user.hideYear ? `${day}.${month}` : `${day}.${month}.${year}`;
    },
    populateFields() {
      this.fields = [
        { name: 'email', label: 'Email', value: this.user.email || '—' },
        { name: 'birthDate', label: 'Дата рождения', value: this.formatDate(this.user.birthdate) || '—' },
        { name: 'workPhone', label: 'Рабочий телефон', value: this.user.workPhone || '—' }
      ];

      if (this.user.personalPhones !== '"[]"') {
        let personalPhones = [];

        try {
          personalPhones = JSON.parse(JSON.parse(this.user.personalPhones));
          if (!Array.isArray(personalPhones))
            throw new Error("Парсированный personalPhones не является массивом");
        } catch (error) {
          console.error("Ошибка парсинга данных", error);
          personalPhones = [];          
        }

        personalPhones.forEach((phone, index) => {
          const phoneValue = phone.hide ? `${phone.number} (скрыто)` : phone.number;
          this.fields.push({
            name: `personalPhone${index}`,
            label: `Личный телефон №${index + 1}`,
            value: phoneValue
          });
        });       
      } else {
        this.fields.push({ name: 'personalPhone', label: 'Личный телефон', value: '—'});
      }

      this.fields.push(
        { name: 'department', label: 'Отдел', value: this.user.department || '—' },
        { name: 'position', label: 'Должность', value: this.user.position || '—' },
        { name: 'workplace', label: 'Рабочее место', value: this.user.office || '—' },
        { name: 'about', label: 'О себе', value: this.user.about || '—' }
      );
    }
  },
  created() {
    this.populateFields();
  }
};
</script>
  
<style>
.user-profile {
  display: flex;
}

.photo-section {
  flex: 1;
}

.button {
  width: 100%;
  margin-top: 2%;
}

.photo-section img {
  max-width: 100%;
  border-radius: 15px;
}

.info-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  margin: 0 5%;
}

.info-row {
  display: flex;
  margin: 10px 0;
}

.info-label {
  flex: 1;
  text-align: left;
}

.info-value {
  flex: 2;
  text-align: left;
}

.info-value input {
  width: 100%;
}

.full-name {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}
</style>
  