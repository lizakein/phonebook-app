<template>
  <div>
    <UserListPage :blocked="1" />
  </div>
</template>

<script>
import UserListPage from '@/views/UserListPage.vue';

export default {
  name: 'BlockedUsersPage',
  components: {
    UserListPage,
  },
  data() {
    return {
      blocked: 1,
    };
  },
};
</script>