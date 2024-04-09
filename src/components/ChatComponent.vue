<template>
    <div class="chat-container">
      <div class="messages">
        <div v-for="message in messages" :key="message.createdAt" class="message">
          <div class="message-header">
            <span class="username">{{ message.createdBy }}</span>
            <span class="timestamp">{{ formatDate(message.createdAt) }}</span>
          </div>
          <p class="message-content">{{ message.text }}</p>
        </div>
      </div>
      <div class="message-input">
        <input v-model="newMessage" placeholder="Type a message..." />
        <button @click="handleSend">Send</button>
        <button @click="handleClearChat">Clear Chat</button>
      </div>
    </div>
  </template>  
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { formatDistanceToNow } from 'date-fns'; // For date formatting
  import { sendMessage, subscribeToChat, clearChat } from '../method/ChatService';
  import { getAuth } from 'firebase/auth';
  
  const auth = getAuth();
  const messages = ref([]);
  const newMessage = ref('');
  
  onMounted(() => {
    subscribeToChat((fetchedMessages) => {
      // Assuming messages include 'createdBy' as username and 'createdAt' as timestamp
      messages.value = fetchedMessages.map(message => ({
        ...message,
        createdBy: message.createdBy || 'Anonymous', // Fallback to 'Anonymous'
        createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
      }));
    });
  });
  
  const handleSend = () => {
    if (newMessage.value.trim() !== '') {
      // Additional parameter for username; adjust based on your app's auth setup
      sendMessage(newMessage.value, auth.currentUser.displayName || 'Anonymous', Date.now());
      newMessage.value = '';
    }
  };

  const handleClearChat = () => {
  const password = prompt("Enter password to clear chat:");
  clearChat(password)
    .then(() => alert("Chat cleared successfully."))
    .catch(error => alert(error.message));
};
  
  const formatDate = (date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  </script>
  
  <style scoped lang="scss">
  .chat-container {
    display: flex;
    flex-direction: column;
    max-height: 500px; 
    border: 2px solid #007bff;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  
    .messages {
        overflow-y: auto;
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    
        &::-webkit-scrollbar {
          width: 8px;
        }
    
        &::-webkit-scrollbar-thumb {
          background-color: #007bff;
          border-radius: 4px;
        }
      
  
      .message {
        max-width: 80%;
        min-width: 20%;
        padding: 10px;
        background-color: #f4f4f8;
        border-radius: 15px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        word-wrap: break-word;
  
        &.mine {
          margin-left: auto;
          background-color: #007bff;
          color: #fff;
  
          .message-header, .message-content {
            color: #fff;
          }
        }
      }
    }
  
    .message-input {
        border-top: 2px solid #007bff;
        padding: 10px;
        background-color: #eee;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    
        input {
          flex: 1;
          padding: 10px;
          margin-right: 10px;
          margin-bottom: 0;
          border: 1px solid #ccc;
          border-radius: 20px;
          outline: none;
        }
    
        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s ease;
    
          &:hover {
            background-color: darken(#007bff, 10%);
          }
        }
        @media (max-width: 600px) {
            input {
              margin-right: 0;
              margin-bottom: 10px;
              width: 100%;
            }
        
            button {
              width: 100%; 
              margin-bottom: 10px;
            }
          }
      }
  
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
  
      .username {
        font-weight: bold;
      }
  
      .timestamp {
        font-size: 0.8rem;
        color: #888;
      }
    }
  
    .message-content {
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  .message-content, .username, .timestamp {
    color: #333;
  }

  @media (max-width: 768px) {
    .chat-container {
      max-height: 300px;
    }
  
    .message {
      max-width: 100%; 

    }
}
  </style>
  