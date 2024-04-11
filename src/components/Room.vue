<template>
    <div>
      <h2>{{ room.name }}</h2>
      <p>{{ room.description }}</p>
      <ul>
        <li v-for="message in room.messages" :key="message.id">
          {{ message.authorName }}: {{ message.text }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      room: Object,
    },
  };
  </script>
  
  