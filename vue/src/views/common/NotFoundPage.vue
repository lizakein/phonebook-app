<template>
  <div class="not-found-page">
    <h1 class="error-num">404</h1>
    <h2 class="not-found-heading">Page Not Found</h2>
    <p class="not-found-desc">Страница, которую вы ищите, не существует.</p>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage'
}
</script>

<style>
.not-found-page {
  margin: 10%;
}
.error-num {
  font-size: 70px;
  margin: 0;
}
.not-found-heading {
  font-size: 48px;
  margin: 0;
}
.not-found-desc {
  font-size: 24px;
}
</style>