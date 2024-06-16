<template>
  <div class="user-info-page">
    <div class="container">
      <h2 class="heading">Введите личные данные</h2>
      <UserDataForm 
        :userData="user" 
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script>
import UserDataForm from '@/components/forms/UserDataForm.vue';
import axios from 'axios';
import { USER_ENDPOINTS } from '@/constants/api';
import errorHelper from '@/helpers/errorHelper';

export default {
  components: {
    UserDataForm
  },
  data() {
    return {
      user: {
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
      },
      token: ''
    };
  },
  methods: {
    handleSave(user) {
      this.user = user;
      this.saveUserData();
    },
    async saveUserData() {
      try {
        // Убираем все поля без телефонов перед сохранением в БД
        const filteredPhones = this.user.personalPhones
          .filter(phone => phone.number.trim() !== '')  
          .map(phone => ({ number: phone.number, hide: phone.hide }));

        const formData = new FormData();
        formData.append('email', this.$route.query.email);
        formData.append('fullName', this.user.fullName);
        formData.append('birthdate', this.user.birthdate);
        formData.append('hideYear', this.user.hideYear);
        formData.append('workPhone', this.user.workPhone);
        formData.append('personalPhones', JSON.stringify(filteredPhones));
        formData.append('department', this.user.department);
        formData.append('position', this.user.position);
        formData.append('office', this.user.office);
        formData.append('about', this.user.about);
        if (this.user.photo) 
          formData.append('photo', this.user.photo); 

        const response = await axios.put(USER_ENDPOINTS.UPDATE_INFO, formData, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        
        this.$router.push(`/profile/${response.data.id}`);       
      } catch (error) {
        console.log(errorHelper.error('SERVER', 'SERVER_ERROR'), error);
      }
    }
  },
  created() {
    this.token = localStorage.getItem('token');
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
</style>
