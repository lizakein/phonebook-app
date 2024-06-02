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
      errorMessage: ''
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
    handleSave() {
      this.saveUserData();
    },
    handleSaveSettings(data) {
      this.saveUserSettings(data);
    },
    async saveUserData() {
      const filteredPhones = this.user.personalPhones
        .filter(phone => phone.number.trim() !== '')
        .map(phone => ({ number: phone.number, hide: phone.hide }));
      
      const userDataToSave = {
        ...this.user,
        personalPhones: filteredPhones
      };

      try {       
        const response = await axios.post('http://localhost:3000/user/user-info', userDataToSave, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200)
          this.$router.push(`/profile/${this.user.id}`);
      } catch (error) {
        console.log(error);
        this.errorMessage = 'Ошибка сервера';
      }
    },
    async saveUserSettings(data) {
      try {
        let emailResponse = { status: 200 };
        let passwordResponse = { status: 200 };

        if (data.newEmail) {
          emailResponse = await axios.post('http://localhost:3000/user/update-email', { newEmail: data.newEmail }, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (data.oldPassword && data.newPassword) {
          passwordResponse = await axios.post('http://localhost:3000/user/update-password', {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
          }, {
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
        const response = await axios.get(`http://localhost:3000/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        let userData = response.data;
        // Проверяем и парсим JSON строку для personalPhones
        if (typeof userData.personalPhones === 'string') 
          userData.personalPhones = JSON.parse(JSON.parse(userData.personalPhones));       

        this.user = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    backToProfile() {
      this.$router.push(`/profile/${this.user.id}`);
    }
  },
  created() {
    this.token = localStorage.getItem('token');
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
