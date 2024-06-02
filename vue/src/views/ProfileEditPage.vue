<template>
  <div class="page-container container">
    <h1>Редактировать профиль</h1>
    <UserForm
      v-if="user"
      :userData="user"
      @save="handleSave"  
    />
    <button class="button" @click="backToProfile">Вернуться обратно</button>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue';
import axios from 'axios';

export default {
  components: {
    UserForm
  },
  data() {
    return {
      user: null,
      token: ''
    };
  },
  methods: {
    handleSave(updateUser) {
      this.user = updateUser;
      this.saveUserData();
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
        console.error('Ошибка сервера:', error);
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
          userData.personalPhones = JSON.parse(userData.personalPhones);       

        this.user = response.data;
      } catch (error) {
        console.error('Ошибка получения данных пользователя', error);
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