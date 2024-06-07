<template>
  <div class="page-container">
    <div class="user-grid">
      <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard.vue';
import axios from 'axios';

export default {
  name: 'UserListPage',
  components: {
    UserCard
  },
  data() {
    return {
      users: []
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Ошибка получения списка пользователей', error);
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
</style>
