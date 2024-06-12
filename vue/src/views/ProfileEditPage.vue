<template>
  <div class="page-container">
    <div class="container">
      <h1>Редактировать профиль</h1>
      <div class="tabs">
        <button 
          :class="{ 'active': formMode === 'settings' }" 
          class="tabs-button" 
          @click="switchToSettings"
        >
          Настройки аккаунта
        </button>
        <button 
          :class="{ 'active': formMode === 'info' }" 
          class="tabs-button" 
          @click="switchToInfo"
        >
          Личная информация
        </button>
      </div>
      <UserSettingsForm 
        v-if="formMode === 'settings'" 
        @save="handleSaveSettings"/>
      <UserDataForm
        v-if="user && formMode === 'info'" 
        :userData="user"
        @save="handleSave"  
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button class="button" @click="backToProfile">Вернуться обратно</button>
    </div>
  </div>
</template>

<script>
import UserDataForm from '@/components/UserDataForm.vue';
import UserSettingsForm from '@/components/UserSettingsForm.vue';
import axios from 'axios';
import { USER_ENDPOINTS } from '@/constants/api';
import { jwtDecode } from 'jwt-decode';

export default {
  components: {
    UserDataForm,
    UserSettingsForm
  },
  data() {
    return {
      user: null,
      token: '',
      formMode: 'settings',
      errorMessage: '',
      isAdmin: false
    };
  },
  methods: {
    switchToSettings() {
      this.formMode = 'settings';
      this.errorMessage = '';
    },
    switchToInfo() {
      this.formMode = 'info';
      this.errorMessage = '';
    },
    handleSave(userDataToUpdate) {
      this.saveUserData(userDataToUpdate);
    },
    handleSaveSettings(data) {
      this.saveUserSettings(data);
    },
    async saveUserData(userDataToUpdate) {
      const filteredPhones = userDataToUpdate.personalPhones
        .filter(phone => phone.number.trim() !== '')
        .map(phone => ({ number: phone.number, hide: phone.hide }));
      
      const userData = {
        ...userDataToUpdate,
        personalPhones: filteredPhones
      };

      try {       
        const response = await axios.post(USER_ENDPOINTS.UPDATE_INFO, userData, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          this.user = { ...userData };
          this.$router.push(`/profile/${this.user.id}`);
        }
      } catch (error) {
        console.log(error);
        this.errorMessage = 'Ошибка сервера';
      }
    },
    async saveUserSettings(data) {
      try {
        let emailResponse = { status: 200 };
        let passwordResponse = { status: 200 };

        const userId = this.$route.params.id;

        if (data.newEmail) {
          emailResponse = await axios.post(USER_ENDPOINTS.UPDATE_EMAIL(userId), { newEmail: data.newEmail }, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (data.newPassword) {
          const payload = this.isAdmin ? { newPassword: data.newPassword } : { oldPassword: data.oldPassword, newPassword: data.newPassword }

          passwordResponse = await axios.post(USER_ENDPOINTS.UPDATE_PASSWORD(userId), payload, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (emailResponse.status === 200 && passwordResponse.status === 200)
          this.$router.push(`/profile/${this.user.id}`);
      } catch (error) {
        if (error.response.data.message) 
          this.errorMessage = error.response.data.message;
        else 
          this.errorMessage = 'Ошибка сервера';
        console.log(error);
      }
    },
    async fetchUserData() {
      try {
        const userId = this.$route.params.id;
        const response = await axios.get(USER_ENDPOINTS.GET_USER_BY_ID(userId), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        let userData = response.data;
        // Проверяем и парсим JSON строку для personalPhones
        if (typeof userData.personalPhones === 'string') {
          userData.personalPhones = JSON.parse(userData.personalPhones);  
          if (!Array.isArray(userData.personalPhones)) 
            userData.personalPhones = JSON.parse(userData.personalPhones)
        }     

        this.user = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    backToProfile() {
      this.$router.push(`/profile/${this.user.id}`);
    },
    decodeToken() {
      try {
        if (this.token) {
          const decodedToken = jwtDecode(this.token);
          this.isAdmin = decodedToken.role === 'admin';
        } 
      } catch (error) {
        console.error('Ошибка получения данных текущего пользователя из токена', error);
      }
    }
  },
  created() {
    this.token = localStorage.getItem('token');
    this.decodeToken();
    this.fetchUserData();
  }
}
</script>

<style>
.page-container {
  display: flex;
  justify-content: center;
}

.container {
  width: 600px;
}
</style>
