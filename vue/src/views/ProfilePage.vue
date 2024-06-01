<template>
  <div class="page-container container">
    <UserProfile :userData="user" v-if="user"/>
  </div>
</template>
  
<script>
import UserProfile from '../components/UserProfile.vue';
import axios from 'axios';

export default {
  components: {
    UserProfile
  },
  data() {
    return {
      user: null
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
    }
  },
  created() {
    this.fetchUserData();
  }
};
</script>

<style>
.page-container {
  margin: 5% 15%;
}
</style>