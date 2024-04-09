<template>
    <MainLayout>
      <div class="feed-container">
        <ChatComponent class="chat-section" />
      </div>
    </MainLayout>
    </template>
    
    <script setup>
    import MainLayout from '../layout/MainLayout.vue';
    import ChatComponent from '../components/ChatComponent.vue';
    import { ref, onMounted } from 'vue';
    import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
    
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

