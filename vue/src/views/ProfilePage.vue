<template>
  <div>
    <component :is="currentHeaderComponent" />
    <div class="page-container">
    <div class="container">
      <UserProfile 
        :userData="user" 
        :isOwner="isOwner"
        :isAdmin="isAdmin"
        v-if="user"
      />
      <div v-if="user && isOwner" class="requests-section">
        <h2>Запросы на просмотр личного номера</h2>
        <div v-if="requests.length === 0">
          <p v-if="!hasHiddenPhone">Ваш номер могут видеть все</p>
          <p v-else>На текущий момент нет запросов</p>
        </div>
        <div v-else>
          <div v-for="request in pendingRequests" :key="request.id" class="request-item">
            <router-link 
              :to="'/profile/' + request.requester_id" 
              class="request-link"
            >
              {{ request.fullName }}
            </router-link>
            <div class="request-buttons">
              <button class="button-accept" @click="acceptRequest(request)">
                Принять
              </button>
              <button class="button-reject" @click="rejectRequest(request)">
                Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
  
<script>
import Header from '@/components/Header.vue';
import AdminDashboard from '@/components/AdminDashboard.vue';
import UserProfile from '../components/UserProfile.vue';
import axios from 'axios';
import { USER_ENDPOINTS } from '@/constants/api';
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'ProfilePage',
  components: {
    UserProfile,
    Header,
    AdminDashboard
  },
  data() {
    return {
      user: null,
      currentUserId: null,
      isOwner: false,
      isAdmin: false,
      requests: [],
      hasHiddenPhone: false,
      currentHeaderComponent: 'Header'
    };
  },
  watch: {
    '$route.params.id': 'fetchUserData'
  },
  computed: {
    pendingRequests() {
      return this.requests.filter(request => request.status === 'pending');
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = this.$route.params.id;
        const response = await axios.get(USER_ENDPOINTS.GET_USER_BY_ID(userId), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.user = response.data;
        this.isOwner = this.user.id === this.currentUserId;
        if (this.isOwner) {
          this.checkHiddenPhone();
          if (!this.isAdmin) this.fetchAccessRequests();
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
          this.isAdmin = decodedToken.role === 'admin';
          this.currentHeaderComponent = decodedToken.role === 'admin' ? 'AdminDashboard' : 'Header';
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
        this.requests = response.data.requests.filter(request => request.status === 'pending');
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
    async acceptRequest(request) {
      try {
        await axios.put(`http://localhost:3000/access/access-request/${request.id}`, { status: 'accepted' }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.fetchAccessRequests();
      } catch (error) {
        console.error('Ошибка при принятии запроса', error);
      }
    },
    async rejectRequest(request) {
      try {
        await axios.put(`http://localhost:3000/access/access-request/${request.id}`, { status: 'rejected' }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.fetchAccessRequests();
      } catch (error) {
        console.error('Ошибка при отклонении запроса', error);
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

.request-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.request-buttons {
  display: flex;
}

.request-buttons button {
  margin-left: 10px;
}

.button-reject {
  background-color: grey;
}
</style>
