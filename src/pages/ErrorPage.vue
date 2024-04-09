<template>
    <MainLayout>
      <div class="error-container">
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <router-link to="/" class="home-link">Go back home</router-link>
      </div>
    </MainLayout>
  </template>
  
  <script>
  import MainLayout from '../layout/MainLayout.vue';
  
  export default {
    components: {
      MainLayout
    }
  }
  </script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--header-footer-height));
  text-align: center;

  h1 {
    font-size: 6rem;
    font-weight: bold;
    color: var(--accent-color);
  }

  p {
    font-size: 1.5rem;
    margin: 1rem 0;
    color: var(--text-color);
  }

  .home-link {
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: #fff;
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--primary-hover);
    }
  }
}
</style>
