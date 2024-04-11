<template>
    <nav>
      <ul>
        <li v-for="room in rooms" :key="room.id" @click="selectRoom(room)">
          {{ room.name }}
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      rooms: Array,
    },
    methods: {
      selectRoom(room) {
        this.$emit('roomSelected', room);
      },
    },
  };
  </script>
  