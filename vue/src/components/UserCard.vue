<template>
  <router-link :to="{ name: 'ProfilePage', params: { id: user.id } }" class="user-card">
    <img :src="getPhotoUrl(user.photo)" class="user-photo" alt="Фото пользователя">
    <div class="user-info">
      <h3>{{ user.fullName }}</h3>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPhotoUrl(photoPath) {
      return `http://localhost:3000/${photoPath.replace(/\\/g, '/')}`;
    }
  }
};
</script>

<style>
.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #0464ca;
  padding: 16px;
  border-radius: 25px;
  background-color: #fff;
}

.user-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}

.user-info h3 {
  margin: 0;
  font-size: 18px;
  text-align: center;
}
</style>
