<template>
    <div>
      <room-navbar :rooms="rooms" @roomSelected="handleRoomSelected" />
      <room v-if="selectedRoom" :room="selectedRoom" />
      <character-selector />
    </div>
  </template>
  
  <script lang="ts">
  import Room from './Room.vue';
  import RoomNavbar from './RoomNavbar.vue';
  import CharacterSelector from './CharacterSelector.vue';
  
  export default {
    components: {
      Room,
      RoomNavbar,
      CharacterSelector,
    },
    data() {
      return {
        rooms: [],
        selectedRoom: null,
      };
    },
    created() {
      this.fetchRooms();
    },
    methods: {
      async fetchRooms() {
        try {
            const response = await fetch('http://localhost:5174/api/rooms');
          if (response.ok) {
            this.rooms = await response.json();
          } else {
            throw new Error('Failed to fetch rooms');
          }
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      },
      handleRoomSelected(room) {
        this.selectedRoom = room;
      },
    },
  };
  </script>
  
  