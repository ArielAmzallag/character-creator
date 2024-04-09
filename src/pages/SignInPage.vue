<template>
    <MainLayout>
        <h1>Sign In to an account</h1>
        <p><input type="text" placeholder="Email" v-model="email"/></p>
        <p><input type="password" placeholder="Password" v-model="password"/></p>
        <p v-if="errMsg">{{ errMsg }}</p>
        <p><button @click="register">Submit</button></p>
        <p><button @click="signInWithGoogle">Sign In With Google</button></p>
    </MainLayout>
    </template>
    <script setup>
    import MainLayout from '../layout/MainLayout.vue';
    import { ref } from 'vue';
    import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import { useRouter } from 'vue-router'
    import { provide } from 'vue';

    const email = ref("");
    const password = ref("");
    const errMsg = ref()
    const router = useRouter()

    const register = () => {

    const auth = getAuth()
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
        console.log("Successfully signed in!");
        console.log(auth.currentUser);
        localStorage.setItem('userEmail', email.value);
        provide('userEmail', email.value);
        router.push('/feed');
    })
    .catch((error) => {
        console.log(error.code);
        switch (error.code) {
            case "auth/invalid-email":
                errMsg.value = "Invalid email";
                break;
            case "auth/user-not-found":
                errMsg.value = "No account with the given email found";
                break;
            case "auth/missing-password":
                errMsg.value = "Please enter a password";
                break;
            case "auth/invalid-credential":
                errMsg.value = "Incorrect password";
                break;
            default:
                errMsg.value = "Email or password is incorrect";
                break;
        }
    });

};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
  .then((result) =>{
    console.log(result.user);
    router.push("/feed");
  })
  .catch((error) => {
        console.log(error.code);
        alert(error.message);
    });
};
</script>