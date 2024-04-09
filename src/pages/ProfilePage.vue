<template>
    <MainLayout>
      <div class="profile-container">
        <h2>User Profile</h2>
  
        <div class="profile-section">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email"
            disabled
          />
          
        </div>
  
        <div class="profile-section">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            :placeholder="randomUsernamePlaceholder" 
            @blur="updateUsername"
          />
          <button @click="generateRandomUsername">Generate Random</button>
          <button @click="validateAndUpdateProfile">Validate Profile</button>
        </div>
          
  
        <div class="profile-section">
          <label for="bio">Bio:</label>
          <textarea 
            id="bio" 
            v-model="bio" 
            placeholder="Tell us about yourself"
            @blur="updateBio"
          ></textarea>
        </div>
  
        <div class="profile-action">
          <button @click="sendPasswordResetEmail">Change Password</button>
        </div>
      </div>
    </MainLayout>
  </template>
  
  
  <script setup>
  import MainLayout from '../layout/MainLayout.vue';
  import { ref, onMounted } from 'vue';
  import { getAuth, updateProfile, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
  
  const auth = getAuth();
  const user = ref(auth.currentUser);
  const email = ref(user.value?.email || '');
  const username = ref(user.value?.displayName || '');
  const bio = ref('');
  
  const updateUsername = async () => {
    if (username.value) {
      try {
        await updateProfile(user.value, {
          displayName: username.value,
        });
        alert('Username updated successfully!');
      } catch (error) {
        console.error('Error updating username:', error);
        alert('There was a problem updating your username.');
      }
    }
  };
  
  const updateBio = async () => {
    console.log('Bio updated to:', bio.value);
    // Add your bio updating logic here
  };
  
  const sendPasswordReset = async () => {
    if (email.value) {
      try {
        await sendPasswordResetEmail(auth, email.value);
        alert('Password reset email sent!');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        alert('There was a problem sending the password reset email.');
      }
    }
  };
  
  const validateAndUpdateProfile = async () => {
    let updatesApplied = false;
  
    if (username.value && username.value !== user.value?.displayName) {
      try {
        await updateProfile(user.value, {
          displayName: username.value,
        });
        console.log('Username updated successfully!');
        updatesApplied = true;
      } catch (error) {
        console.error('Error updating username:', error);
        alert('There was a problem updating your username.');
      }
    }
  
    // ...include additional logic for other profile updates, if any
  
    if (updatesApplied) {
      alert('Profile updated successfully!');
    }
  };
  
  const generateRandomUsername = () => {
    const adjectives = ["Mighty", "Ancient", "Mystic", "Shadow", "Quiet"];
    const nouns = ["Wizard", "Sorcerer", "Mage", "Warlock", "Sage"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    username.value = `${adjective}${noun}${number}`;
  };
  
  onMounted(() => {
    onAuthStateChanged(auth, (newUser) => {
      if (newUser) {
        user.value = newUser;
        email.value = newUser.email;
        username.value = newUser.displayName;
        // Here you would also fetch the bio if it's stored outside of the auth state
      }
    });
  });
  </script>
  
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: auto;
    padding: 2rem;
    border-radius: 10px;
    background: var(--background-color);
    color: var(--text-color);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  
    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }
  
    .profile-section {
      margin-bottom: 1rem;
      
      label {
        display: block;
        margin-bottom: .5rem;
      }
  
      input {
        width: 100%;
        padding: .5rem;
        margin-bottom: .5rem;
      }
  
      button {
        padding: .5rem 1rem;
        background-color: var(--accent-color);
        border: none;
        color: var(--text-color);
        cursor: pointer;
  
        &:hover {
          background-color: darken(var(--accent-color), 10%);
        }
      }
    }
  }
  </style>
  