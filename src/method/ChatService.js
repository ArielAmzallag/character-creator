import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove, push, onValue, query, limitToLast } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

export const clearChat = async () => {
  const auth = getAuth();
  const authorizedUid = "rAwxD6QQViOsP0zAnpiagC5Dcri2"; // UID of the authorized user

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
      if (user && user.uid === authorizedUid) {
        const chatRef = ref(db, 'chats');
        remove(chatRef)
          .then(() => resolve("Chat cleared successfully."))
          .catch(error => reject(new Error("Failed to clear chat: " + error.message)));
      } else {
        reject(new Error("Access denied: You are not authorized to perform this operation."));
      }
    }, error => {
      reject(new Error("Authentication check failed: " + error.message));
    });
  });
};

export const subscribeToChat = (callback) => {
  const chatQuery = query(ref(db, 'chats'), limitToLast(20));
  onValue(chatQuery, (snapshot) => {
    const messages = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
    }
    callback(messages);
  });
};

