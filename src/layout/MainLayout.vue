<template>
    <div class="main-layout">
      <header>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <nav>
            <li><router-link to="/"><i class="fas fa-home"></i>Main Page</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register"><i class="fas fa-user-plus"></i>Register</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/sign-in"><i class="fas fa-sign-in-alt"></i>Sign-In</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/character-creator"><i class="fas fa-user-cog"></i>Character Creator</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/compendium"><i class="fas fa-book"></i>Compendium</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/public-characters"><i class="fas fa-users"></i>Public Characters</router-link></li>
            <li><router-link to="/feed"><i class="fas fa-rss"></i>Feed</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/profile"><i class="fas fa-user"></i>Profile</router-link></li>
            <li v-if="isLoggedIn"><button @click="handleSignOut"><i class="fas fa-sign-out-alt"></i>Sign out</button></li>
        </nav>
      </header>
      
  
      <main>
        <slot></slot> 
      </main>
  
      <footer>
        <p>© 2024 Palace of Fantasy. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, reactive } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'MainLayout',
    setup() {
      const isLoggedIn = ref(false);
      const userEmail = ref(localStorage.getItem('userEmail'));
      const router = useRouter();
      const isNavbarVisible = ref(false);
      let auth;
  
      onMounted(() => {
        auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          isLoggedIn.value = !!user;
          if (user) {
            userEmail.value = localStorage.getItem('userEmail');
          }
        });
      });


      const handleSignOut = () => {
        signOut(auth).then(() => {
          localStorage.removeItem('userEmail');
          userEmail.value = null;
          router.push("/");
        });
      };
  
      return {
        isLoggedIn,
        userEmail,
        handleSignOut,
        isNavbarVisible,
      };
    }
  }
  </script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  header {
    background-color: var(--primary-color, #333); /* Default color added for safety */
    padding: 20px 0;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px; /* Spacing between menu items */
      list-style: none; /* Removes bullet points */
      padding: 0;
      margin: 0 auto;
      width: 90%; /* Adjust based on your design preference */
      
      li {
        display: inline-block; /* Align items horizontally */
        
        a, button {
          display: flex;
          align-items: center;
          gap: 5px; /* Spacing between icon and text */
          color: #fff; /* Text color */
          text-decoration: none; /* Removes underline from links */
          &:hover {
            color: var(--accent-color, lightblue); /* Change as needed */
          }
        }
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
        color: #fff; /* Text color, ensuring consistency with links */

        &:hover {
          color: var(--accent-color, lightblue); /* Hover state */
        }
      }
    }
  }

  main {
    padding: 20px;
    padding-top: 80px; /* Increased top padding to account for fixed header */
    flex-grow: 1;
    background-color: transparent;
  }

  footer {
    background-color: var(--primary-color, #333); /* Default color added for safety */
    color: var(--text-color, #fff); /* Default text color */
    text-align: center;
    padding: 10px;
    border-top: 1px solid var(--border-color, #444); /* Default border color */
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;

    p {
      margin: 0;
    }
  }
}
</style>



  


