import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove, push, onValue, query, limitToLast } from "firebase/database";
import app from '../../firebaseConfig';

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
