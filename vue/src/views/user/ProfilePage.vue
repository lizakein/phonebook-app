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
import Header from '@/components/common/Header.vue';
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import UserProfile from '@/components/user/UserProfile.vue';
import axios from 'axios';
import { USER_ENDPOINTS } from '@/constants/api';
import { jwtDecode } from 'jwt-decode';
import apiProvider from '@/services/apiProvider';
import errorHelper from '@/helpers/errorHelper';

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
          if (!this.isAdmin) this.fetchAccessRequests(this.userId);
        }
      } catch(error) {
        console.error(errorHelper.error('USER', 'USER_DATA_FETCH_ERROR'), error);
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
        console.error(errorHelper.error('USER', 'TOKEN_USER_DATA_ERROR'), error);
      }
    },
    async fetchAccessRequests(userId) {
      try {
        this.requests = await apiProvider.fetchAccessRequests(userId, 'pending');
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'REQUEST_FETCH_ERROR'), error);
      }
    },
    checkHiddenPhone() {
      try {
        let personalPhones = JSON.parse(this.user.personalPhones);
        if (!Array.isArray(personalPhones)) 
          personalPhones = JSON.parse(personalPhones);

        this.hasHiddenPhone = personalPhones.some(phone => phone.hide);
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'HIDDEN_PHONE_CHECK_ERROR'), error);
      }
    },
    async acceptRequest(request) {
      try {
        await apiProvider.updateAccessRequestStatus(request.id, 'accepted');
        this.fetchAccessRequests(this.user.id);
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'REQUEST_ACCEPT_ERROR'), error);
      }
    },
    async rejectRequest(request) {
      try {
        await apiProvider.updateAccessRequestStatus(request.id, 'rejected');
        this.fetchAccessRequests(this.user.id);
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'REQUEST_REJECT_ERROR'), error);
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
