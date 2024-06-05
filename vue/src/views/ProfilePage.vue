<template>
  <div class="page-container">
    <div class="container">
      <UserProfile 
        :userData="user" 
        :isOwner="user?.isOwner"
        v-if="user"
      />
    </div>
  </div>
</template>
  
<script>
import UserProfile from '../components/UserProfile.vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  components: {
    UserProfile
  },
  data() {
    return {
      user: null,
      currentUserId: null,
      isOwner: false
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = this.$route.params.id;
        const responce = await axios.get(`http://localhost:3000/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.user = responce.data;
      } catch(error) {
        console.error('Ошибка получения пользовательских данных', error);
      }
    },
    fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          this.currentUserId = decodedToken.id;
        } 
      } catch (error) {
        console.log('Ошибка получения данных текущего пользователя из токена', error);
      }
    }
  },
  created() {
    this.fetchCurrentUser();
    this.fetchUserData();
  }
};
</script>

<style>
.page-container {
  display: flex;
  justify-content: center;
  margin: 5% 15%;
}
</style>