<template>
  <header class="header">
    <h1 class="title">Phonebook</h1>
    <nav>
      <router-link to="/users" class="nav-link">Все пользователи</router-link>
      <router-link :to="{ name: 'ProfilePage', params: { id: currentUserId } }" class="nav-link">Мой профиль</router-link>
      <button @click="logout" class="logout-button">Выйти</button>
    </nav>
  </header>
</template>

<script>
import { jwtDecode } from 'jwt-decode';
import errorHelper from '@/helpers/errorHelper';

export default {
  name: 'Header',
  data() {
    return {
      currentUserId: null
    };
  },
  created() {
    this.fetchCurrentUser();
  },
  methods: {
    fetchCurrentUser() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.currentUserId = decodedToken.id;
        } catch (error) {
          console.error(errorHelper.error('USER', 'DECODE_TOKEN_ERROR'), error);
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/login');
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.header {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
}

.title {
  color: #0464ca;
  margin: 0;
}

.nav-link {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}

.logout-button {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  margin-right: 40px;
}

.logout-button:hover {
  text-decoration: underline;
}
</style>
