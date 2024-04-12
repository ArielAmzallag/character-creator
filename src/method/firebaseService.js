import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseConfig';


const db = getDatabase(app);

async function fetchRooms() {
    const roomsRef = collection(db, 'rooms');
    const querySnapshot = await getDocs(roomsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  async function createRoom(name) {
    await addDoc(collection(db, 'rooms'), {
      name,
      createdAt: serverTimestamp() // Use server timestamp for consistency
    });
  }
  
  async function fetchMessages(roomId) {
    const messagesRef = collection(db, `rooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'desc')); // Assuming you want the latest messages
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(messageDoc => ({
      id: messageDoc.id,
      ...messageDoc.data()
    }));
  }
  
  async function sendMessage(roomId, characterId, text) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
  
    // Fetch character name using characterId
    const characterRef = doc(db, 'characters', characterId);
    const characterSnap = await getDoc(characterRef);
    const characterName = characterSnap.exists() ? characterSnap.data().name : 'Unknown';
  
    // Send message
    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text,
      senderId: user.uid,
      senderName: characterName,
      timestamp: serverTimestamp() // Use server timestamp
    });
  }

  async function fetchMyCharacters() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return [];
  
    const charactersRef = collection(db, 'characters');
    const q = query(charactersRef, where('createdBy', '==', user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

export default {
  fetchRooms,
  fetchMessages,
  sendMessage,
  fetchMyCharacters,
  createRoom
};
