<template>
  <MainLayout>
    <div class="feed-container">
      <div class="latest-characters">
        <h2>Latest Characters</h2>
        <ul>
          <li v-for="character in latestCharacters" :key="character.id">
            <h3>{{ character.name }}</h3>
            <p>By {{ character.creatorName }} - {{ character.universe }}</p>
            <p>{{ character.description }}</p>
          </li>
        </ul>
      </div>
      <!-- Including Room Navigation and Character Selection in the Feed -->
      <ChatComponent class="chat-section" />
    </div>
  </MainLayout>
</template>

    
<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '../layout/MainLayout.vue';
import ChatComponent from '../components/ChatComponent.vue';
import Room from '../components/Room.vue';
import RoomNavbar from '../components/RoomNavbar.vue';
import CharacterSelector from '../components/CharacterSelector.vue';
import latestCharactersComponent from '../components/LatestCharacterComponent.vue';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

// Data properties
const latestCharacters = ref([]);
const rooms = ref([]);
const selectedRoom = ref(null);

// Fetch the latest characters from Firestore
const fetchLatestCharacters = async () => {
  try {
    const charactersQuery = query(collection(db, 'characters'), orderBy('creationDate', 'desc'), limit(5));
    const querySnapshot = await getDocs(charactersQuery);
    latestCharacters.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching latest characters: ", error);
  }
};

// // Fetch the list of rooms from your Laravel backend
// const fetchRooms = async () => {
//   try {
//     const response = await fetch('http://localhost:5174/api/rooms');
//     if (response.ok) {
//       rooms.value = await response.json();
//     } else {
//       throw new Error('Failed to fetch rooms');
//     }
//   } catch (error) {
//     console.error('Error fetching rooms:', error);
//   }
// };

// // Handle room selection
// const handleRoomSelected = (room) => {
//   selectedRoom.value = room;
// };

 onMounted(() => {
  fetchLatestCharacters();
//   fetchRooms();
});
</script>


<style scoped lang="scss">
.feed-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  gap: 20px;
  margin: 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.latest-characters {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
    h2 {
      color: #007bff;
      margin-bottom: 20px;
      text-align: center;
    }
  
    ul {
      list-style: none;
      padding: 0;
  
      li {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eaeaea;
  
        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
  
        h3 {
          color: #333;
          margin: 0 0 5px 0;
        }
  
        p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
  
          &:first-of-type {
            color: #007bff;
            font-weight: bold;
          }
        }
      }
    }
  }
  
  .chat-section {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

  .chat-container {
    height: auto;
    max-height: 500px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;


    .messages {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 20px;
      padding: var(--spacing-base);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #007bff;
        border-radius: 3px;
      }
      .message {
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-base);
        &:last-child {
          margin-bottom: 0;
        }
    }

    .message-input {
      display: flex;
      margin-top: var(--spacing-base);
      border-top: 1px solid #ccc;

      input {
        flex: 1;
        margin-right: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 20px;
        outline: none;
        height: 48px;
        border-radius: var(--border-radius);
      }

      button {
        padding: 10px 15px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        height: 48px;
        border-radius: var(--border-radius);

        &:hover {
          background-color: darken(#007bff, 10%);
        }
        
      }

      
    }
  }
}
}
</style>

