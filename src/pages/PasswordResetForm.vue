<template>
    <MainLayout>
      <div class="password-reset-form">
        <h1>Reset Password</h1>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
              autofocus
            />
          </div>
          <button type="submit" :disabled="isSubmitting">Send Reset Link</button>
          <button type="button" @click="backToPreviousPage" class="back-button">Back</button>
          <p v-if="message" class="message">{{ message }}</p>
        </form>
      </div>
    </MainLayout>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import MainLayout from '../layout/MainLayout.vue';
  import { sendPasswordReset } from '../method/firebaseAuthService';
  
  const router = useRouter();
  const email = ref('');
  const isSubmitting = ref(false);
  const message = ref('');
  
  // Check if the user is authenticated
  let isAuthenticated = false;
  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      isAuthenticated = !!user;
    });
  });
  
  const backToPreviousPage = () => {
  const lastRouteName = sessionStorage.getItem('lastRouteName');
  if (isAuthenticated) {
    // Assuming '/profile' is the correct path to your profile page
    router.push(lastRouteName || '/profile');
  } else {
    router.push('/sign-in');
  }
};

  </script>
  
  <style scoped>
  .password-reset-form {
    max-width: 400px;
    margin: auto;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  
  button {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  .message {
    margin-top: 1rem;
    color: #007bff;
  }
  </style>
  