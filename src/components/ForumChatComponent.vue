<template>
    <div class="forum-chat-component">
      <!-- Chat Messages -->
      <div class="messages">
        <div class="message" v-for="message in messages" :key="message.timestamp">
          <div class="message-header">
            <span class="username">{{ message.senderName }}</span>
            <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
          </div>
          <p class="message-content">{{ message.text }}</p>
        </div>
      </div>
      <!-- Message Input Bar -->
      <div class="message-input">
        <input type="text" v-model="newMessage" placeholder="Type a message" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
<script>
import { ref, onMounted } from 'vue';
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
    roomId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fetchMessages();
      }
    }
  },
  onMounted() {
    this.fetchMessages();
  }
};
</script>

  