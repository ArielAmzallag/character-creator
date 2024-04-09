import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyDaE2qtC1emo0ANcMHRAs6dfiHbq70sesk",
    authDomain: "character-creator-26852.firebaseapp.com",
    projectId: "character-creator-26852",
    storageBucket: "character-creator-26852.appspot.com",
    messagingSenderId: "89708340253",
    appId: "1:89708340253:web:97239455bbe3acc80792f4",
    measurementId: "G-4P8V2339NZ"
  };

initializeApp(firebaseConfig);


const pinia = createPinia()
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
