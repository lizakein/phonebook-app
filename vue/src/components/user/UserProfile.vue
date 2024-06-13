<template>
  <div class="user-profile">
    <div class="photo-section">
      <img v-if="user.photo" :src="getPhotoUrl(user.photo)" alt="Фото пользователя">
      <button 
        v-if="isOwner || isAdmin"
        class="button" 
        @click="editProfile"
      >
        Редактировать профиль
      </button>
      <button 
        v-if="isAdmin"
        :class="['button', { 'blocked-button': user.isBlocked }]" 
        @click="toggleBlockUser"
      >
        {{ user.isBlocked ? 'Разблокировать' : 'Заблокировать' }}
      </button>
      <button 
        v-if="!isOwner && !isAdmin && hasHiddenPhone && !requestExists" 
        class="button" 
        @click="requestAccess"
      >
        Запросить доступ к личному номеру
      </button>
    </div>
    <div class="info-section">
      <div class="full-name"> {{ user.fullName }}</div>
      <div v-if="!user.isBlocked || isAdmin">
        <div v-for="(field, index) in fields" :key="index" class="info-row">
          <div class="info-label">{{ field.label }}</div>
          <div class="info-value">
            <span>{{ field.value }}</span>        
          </div>
        </div>
      </div>    
      <p v-else>Пользователь заблокирован</p>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import { BASE_URL, USER_ENDPOINTS } from '@/constants/api';
import { String } from 'core-js';
import { jwtDecode } from 'jwt-decode';
import apiProvider from '@/services/apiProvider';
import errorHelper from '@/helpers/errorHelper';

export default {
  name: 'UserProfile',
  props: {
    userData: {
      type: Object,
      required: true
    },
    isOwner: {
      type: Boolean,
      required: true,
      default: false
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const currentUserId = decodedToken ? decodedToken.id : null;

    return {
      user: { ...this.userData },
      fields: [],
      personalPhones: [],
      hasHiddenPhone: false,
      requestExists: false,
      currentUserId: currentUserId
    };
  },
  methods: {
    getPhotoUrl(photoPath) {
      return `${BASE_URL}/${photoPath.replace(/\\/g, '/')}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return this.user.hideYear ? `${day}.${month}` : `${day}.${month}.${year}`;
    },
    async populateFields() {
      this.personalPhones = [];
      
      const baseFields = [
        { name: 'email', label: 'Email', value: this.user.email || '—' },
        { name: 'birthDate', label: 'Дата рождения', value: this.formatDate(this.user.birthdate) || '—' },
        { name: 'workPhone', label: 'Рабочий телефон', value: this.user.workPhone || '—' },
        { name: 'department', label: 'Отдел', value: this.user.department || '—' },
        { name: 'position', label: 'Должность', value: this.user.position || '—' },
        { name: 'workplace', label: 'Рабочее место', value: this.user.office || '—' },
        { name: 'about', label: 'О себе', value: this.user.about || '—' }
      ];

      if (this.user.personalPhones !== '"[]"') {
        let personalPhones = [];

        try {
          personalPhones = JSON.parse(this.user.personalPhones);
          if (!Array.isArray(personalPhones)) 
            personalPhones = JSON.parse(personalPhones)
        } catch (error) {
          console.error(errorHelper.error('PARSING', 'DATA_PARSING_ERROR'), error);
          personalPhones = [];
        }

        let accessGranted = false;
        if (!this.isOwner && !this.isAdmin) {
          try {
            const response = await apiProvider.chackAccessStatus(this.currentUserId, this.user.id);
            accessGranted = response.data.status === 'accepted';
          } catch (error) {
            if (error.response && error.response.status === 404)
              accessGranted = false;
            else
              console.error(errorHelper.error('ACCESS', 'CHECK_STATUS_ERROR'), error);
          }
        }

        personalPhones.forEach(phone => {
          if (phone.hide && !this.isOwner && !this.isAdmin && !accessGranted) 
            this.hasHiddenPhone = true;
          else 
            if (!this.personalPhones.some(item => item.number === phone.number))
              this.personalPhones.push({ number: phone.number });
        });

        if (this.personalPhones.length > 0) {
          baseFields.splice(3, 0, {
            name: 'personalPhones',
            label: 'Личный телефон',
            value: this.personalPhones.map(phone => phone.number).join(', ')
          });
        } else {
          baseFields.splice(3, 0, {
            name: 'personalPhones',
            label: 'Личный телефон',
            value: '—'
          });
        }
      } else {
        baseFields.splice(3, 0, {
          name: 'personalPhones',
          label: 'Личный телефон',
          value: '—'
        });
      }
      this.fields = baseFields;
    },
    editProfile() {
      this.$router.push(`/profile/${this.user.id}/edit`);
    },
    async requestAccess() {
      try {
        await apiProvider.requestAccess(this.user.id);
        this.requestExists = true;
      } catch(error) {
        console.error(errorHelper.error('ACCESS', 'CHECK_REQUEST_ERROR'), error);
      }
    },
    async checkAccessRequest() {
      if (!this.isAdmin && this.currentUserId !== this.user.id && this.hasHiddenPhone) {
        try {
          const response = await apiProvider.checkAccessRequest(this.currentUserId, this.user.id);
          this.requestExists = response.data.exists;
        } catch (error) {
          if (error.response && error.response.status === 404)
            this.requestExists = false;
          else {
            console.error(errorHelper.error('ACCESS', 'CHECK_REQUEST_ERROR'), error);
            this.requestExists = false;
          }
        }
      } else {
        this.requestExists = true;
      }
    },
    async toggleBlockUser() {
      try {
        const userId = this.$route.params.id;
        const newBlockStatus = !this.user.isBlocked;
        const token = localStorage.getItem('token');

        const response = await axios.post(USER_ENDPOINTS.UPDATE_BLOCK_STATUS(userId), {isBlocked: newBlockStatus}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200)
          this.user.isBlocked = newBlockStatus;
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'STATUS_UPDATE_ERROR'), error);
      }
    }
  },
  async mounted() {
    await this.populateFields();
    await this.checkAccessRequest();
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        this.user = { ...newValue };
        this.populateFields();
      }
    }
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

.blocked-button {
  background-color: grey;
  color: white; 
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
  