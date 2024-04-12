<template>
  <div class="room-list">
    <div class="room" v-for="room in rooms" :key="room.id">
      <router-link :to="`/chat/${room.id}`">{{ room.name }}</router-link>
    </div>
    <div class="add-room">
      <input type="text" v-model="newRoomName" placeholder="New Room Name" />
      <button @click="createRoom">+</button>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import firebaseService from '../method/firebaseService';
import { formatDistanceToNow } from 'date-fns'; // For date formatting

export default {
  props: {
    roomId: String
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      selectedCharacterId: localStorage.getItem('selectedCharacterId') || ''
    };
  },
  methods: {
    async fetchMessages() {
      this.messages = await firebaseService.fetchMessages(this.roomId);
    },
    async sendMessage() {
      if (this.newMessage.trim()) {
        await firebaseService.sendMessage(this.roomId, this.selectedCharacterId, this.newMessage);
        this.newMessage = ''; // Reset input
        this.fetchMessages(); // Refresh messages
      }
    },
    formatDate(timestamp) {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    }
  },
  watch: {
    roomId: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.fetchMessages();
        }
      }
    }
  },
  mounted() {
    this.fetchMessages();
  }
};
</script>

