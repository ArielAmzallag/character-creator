<template>
    <div class="forum">
      <aside class="sidebar">
        <RoomList :rooms="rooms" @roomSelected="selectRoom" />
        <CharacterSwitcher :characters="characters" @characterSelected="selectCharacter" />
      </aside>
      <div class="chat-container">
        <ForumChatComponent :roomId="selectedRoom" :characterId="selectedCharacter" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import RoomList from './RoomList.vue';
  import CharacterSwitcher from './CharacterSwitcher.vue';
  import ForumChatComponent from './ForumChatComponent.vue';
  import firebaseService from '../method/firebaseService';
  import ChatComponent from './ChatComponent.vue';
  
  const rooms = ref([]);
  const characters = ref([]);
  const selectedRoom = ref(null);
  const selectedCharacter = ref(null);
  
  const fetchRooms = async () => {
    rooms.value = await firebaseService.fetchRooms();
  };
  
  const fetchCharacters = async () => {
    characters.value = await firebaseService.fetchMyCharacters();
  };
  
  const selectRoom = (roomId) => {
    selectedRoom.value = roomId;
  };
  
  const selectCharacter = (characterId) => {
    selectedCharacter.value = characterId;
  };
  
  onMounted(async () => {
    await fetchRooms();
    await fetchCharacters();
  });

  
  </script>
  
  <style>
  .forum {
    display: flex;
    height: 100%;
  
    .sidebar {
      flex-basis: 200px;
      border-right: 1px solid #ccc;
      padding: 1rem;
      overflow-y: auto;
    }
  
    .chat-container {
      flex-grow: 1;
      padding: 1rem;
    }
  }
  </style>
  