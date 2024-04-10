<template>
    <MainLayout>
        <h1>Create an account</h1>
        <h3>Email</h3>
        <p><input type="text" placeholder="Email" v-model="email"/></p>
        <h3>Password</h3>
        <p><input type="password" placeholder="Password" v-model="password"/></p>
        <p><button @click="register">Submit</button></p>
        <p><button @click="signInWithGoogle">Sign In With Google</button></p>
    </MainLayout>
  </template>
  
  <script setup>
  import MainLayout from '../layout/MainLayout.vue';
  import { ref } from 'vue';
  import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
  } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const email = ref("");
  const password = ref("");
  const phoneNumber = ref("");
  const router = useRouter();
  
  const validatePassword = (password) => {
      const requirements = [
          { test: (pw) => pw.length >= 10 && pw.length <= 30, message: "Password must be between 10 and 30 characters long." },
          { test: (pw) => /[A-Z]/.test(pw), message: "Password must contain at least one uppercase letter." },
          { test: (pw) => /[a-z]/.test(pw), message: "Password must contain at least one lowercase letter." },
          { test: (pw) => /\d/.test(pw), message: "Password must contain at least one number." },
          { test: (pw) => /\W/.test(pw), message: "Password must contain at least one special character." },
      ];
  
      const failingRequirement = requirements.find((requirement) => !requirement.test(password));
      return failingRequirement ? failingRequirement.message : null;
  };
  
  const register = () => {
      const passwordValidationResult = validatePassword(password.value);
      if (passwordValidationResult !== null) {
          alert(`Password does not meet requirements: ${passwordValidationResult}`);
          return;
      }
  
      createUserWithEmailAndPassword(getAuth(), email.value, password.value)
          .then((userCredential) => {
              console.log("Successfully registered", userCredential.user);
  
              sendEmailVerification(userCredential.user)
                .then(() => {
                  console.log("Verification email sent.");
                  alert("Verification email sent. Please check your inbox.");
                  router.push("/verify-email");
                })
                .catch((error) => {
                  console.error("Error sending verification email", error);
                  alert("Failed to send verification email.");
                });
          })
          .catch((error) => {
              console.error("Error during account creation", error);
              alert(error.message);
          });
  };
  
  const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
      .then((result) => {
          console.log(result.user);
          if (result.user.emailVerified) {
            router.push("/feed");
          } else {
            router.push("/verify-email");
          }
      })
      .catch((error) => {
          console.log(error.code);
          alert(error.message);
      });
  };
  </script>
  
  <style lang="scss" scoped>
  .login__main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
  
    h1 {
      color: var(--secondary-color);
      margin-bottom: 20px;
    }
  
    section {
      background: rgba(0, 0, 0, 0.5);
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 400px;
      border: 1px solid var(--border-color);
    }
  }
  </style>
  
  