<template>
  <div>
    <component :is="currentHeaderComponent" />
    <div class="page-container">
      <div class="user-grid">
        <UserCard v-for="user in users" :key="user.id" :user="user" />
        <div v-if="isEmptyList" class="empty-list">Список пуст</div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue';
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import UserCard from '@/components/common/UserCard.vue';
import axios from 'axios';
import { USER_ENDPOINTS } from '@/constants/api';
import { jwtDecode } from 'jwt-decode';
import errorHelper from '@/helpers/errorHelper';

export default {
  name: 'UserListPage',
  components: {
    UserCard,
    Header,
    AdminDashboard
  },
  props: {
    blocked: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      users: [],
      isEmptyList: false,
      currentHeaderComponent: 'Header'
    };
  },
  async created() {
    this.fetchCurrentUser();
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(USER_ENDPOINTS.GET_USERS_BY_BLOCK_STATUS, {
          params: {
            blocked: this.blocked
          },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.users = response.data;
        if (this.users.length === 0) this.isEmptyList = true;
      } catch (error) {
        console.error(errorHelper.error('USER', 'GET_USER_LIST_ERROR'), error);
      }
    },
    fetchCurrentUser() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.currentHeaderComponent = decodedToken.role === 'admin' ? 'AdminDashboard' : 'Header';
        } catch (error) {
          console.error(errorHelper.error('USER', 'DECODE_TOKEN_ERROR'), error);
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style>
.page-container {
  display: flex;
  justify-content: center;
  margin: 5% 15%;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

.empty-list {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 50px;
  color: gray;
}
</style>
