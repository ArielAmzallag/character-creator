import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDaE2qtC1emo0ANcMHRAs6dfiHbq70sesk",
    authDomain: "character-creator-26852.firebaseapp.com",
    databaseURL: "https://character-creator-26852-default-rtdb.europe-west1.firebasedatabase.app", // Updated URL
    projectId: "character-creator-26852",
    storageBucket: "character-creator-26852.appspot.com",
    messagingSenderId: "89708340253",
    appId: "1:89708340253:web:97239455bbe3acc80792f4",
    measurementId: "G-4P8V2339NZ"
  };

const app = initializeApp(firebaseConfig);
export default app;