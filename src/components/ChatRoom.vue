<template>
  <div>
    <div v-for="message in messages" :key="message.id" class="message">
      <strong>{{ message.characterName }}:</strong> {{ message.text }}
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import firebaseService from '../method/firebaseService';

export default {
  setup() {
    const route = useRoute();
    const newMessage = ref('');
    const messages = ref([]);

    const roomId = ref(route.params.roomId);
    const characterId = ref(localStorage.getItem('selectedCharacterId') || '');

    const fetchMessages = async () => {
      messages.value = await firebaseService.fetchMessages(roomId.value);
    };

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        firebaseService.sendMessage(roomId.value, characterId.value, newMessage.value);
        newMessage.value = '';
      }
    };

    onMounted(fetchMessages);

    return { messages, newMessage, sendMessage };
  }
};
</script>

<style scoped>
.message {
  margin-bottom: 10px;
}
</style>
