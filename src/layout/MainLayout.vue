<template>
    <div class="main-layout">
      <header>
        <nav>
          <ul>
            <li><router-link to="/">Main Page</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/sign-in">Sign-In</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/character-creator">Character Creator</router-link></li>
            <li><router-link to="/feed">Feed</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/profile">Profile</router-link></li>
            <li v-if="userEmail">{{ userEmail }}</li>
            <li v-if="isLoggedIn"><button @click="handleSignOut">Sign out</button></li>
          </ul>
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
    background-color: var(--primary-color);
    padding: 20px 0;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    nav {
      width: 100%;
      ul {
        list-style-type: none;
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0;

        li {
          margin: 0 15px;
        }

        a {
          color: #fff;
          &:hover {
            color: var(--accent-color);
          }
        }
      }
    }
  }

  main {
    padding: 20px;
    padding-top: 60px;
    flex-grow: 1;
    background-color: transparent;
  }

  footer {
    background-color: var(--primary-color);
    color: var(--text-color);
    text-align: center;
    padding: 10px;
    border-top: 1px solid var(--border-color);
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    main {
      padding-bottom: 50px;
    }

    p {
      margin: 0;
    }
  }
}

</style>


  


