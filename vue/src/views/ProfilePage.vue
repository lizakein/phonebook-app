<template>
  <div class="page-container">
    <div class="container">
      <UserProfile 
        :userData="user" 
        :isOwner="user?.isOwner"
        v-if="user"
      />
      <div v-if="user && user?.isOwner" class="requests-section">
        <h2>Запросы на просмотр личного номера</h2>
        <div v-if="requests.length === 0">
          <p v-if="!hasHiddenPhone">Ваш номер могут видеть все</p>
          <p v-else>На текущий момент нет запросов</p>
        </div>
        <div v-else>
          <div v-for="request in requests" :key="request.id">
            <router-link :to="'/profile/' + request.requester_id">{{ request.fullName }}</router-link>
          </div>
        </div>
      </div>
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
      isOwner: false,
      requests: [],
      hasHiddenPhone: false
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3000/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.user = response.data;
        this.isOwner = this.user.id === this.currentUserId;
        if (this.isOwner) {
          this.checkHiddenPhone();
          this.fetchAccessRequests();
        }
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
        console.error('Ошибка получения данных текущего пользователя из токена', error);
      }
    },
    async fetchAccessRequests() {
      try {
        const response = await axios.get(`http://localhost:3000/access/access-requests/${this.user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.requests = response.data.requests;
      } catch (error) {
        console.error('Ошибка получения запросов на доступ', error);
      }
    },
    checkHiddenPhone() {
      try {
        let personalPhones = JSON.parse(this.user.personalPhones);
        if (!Array.isArray(personalPhones)) 
          personalPhones = JSON.parse(personalPhones);

        this.hasHiddenPhone = personalPhones.some(phone => phone.hide);
      } catch (error) {
        console.error('Ошибка проверки скрытых номеров', error);
      }
    },
    handleAccessRequest(request) {
      // обработка отклонения и принятия запроса
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