<template>
  <header class="admin-dashboard">
    <h1 class="title">Phonebook - Admin Dashboard</h1>
    <nav>
      <router-link to="/users" class="nav-link">Управление пользователями</router-link>
      <router-link to="/admin/requests" class="nav-link">Запросы доступа</router-link>
      <router-link to="/admin/deleted-users" class="nav-link">Удаленные пользователи</router-link>
      <button @click="logout" class="logout-button">Выйти</button>
    </nav>   
  </header>
</template>

<script>
export default {
  name: 'AdminDashboard',
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/admin/login');
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
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
  font-size: 24px;
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
