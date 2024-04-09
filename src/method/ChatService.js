import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove, push, onValue, query, limitToLast } from "firebase/database";
import app from '../../firebaseConfig';

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
  
const db = getDatabase(app);

export const sendMessage = (messageContent, userId) => {
  const chatRef = ref(db, 'chats');
  push(chatRef, {
    text: messageContent,
    createdBy: userId,
    createdAt: Date.now(),
  });
};

export const clearChat = async (password) => {
    const expectedPassword = "Rampage120%";
    if (password === expectedPassword) {
      const chatRef = ref(db, 'chats');
      return remove(chatRef);
    } else {
      return Promise.reject(new Error("Incorrect password"));
    }
  };

export const subscribeToChat = (callback) => {
  const chatQuery = query(ref(db, 'chats'), limitToLast(20));
  onValue(chatQuery, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    callback(messages);
  });
};
