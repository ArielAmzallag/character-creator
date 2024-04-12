<template>
    <select v-model="selectedCharacter" @change="switchCharacter">
      <option v-for="character in characters" :key="character.id" :value="character.id">
        {{ character.name }}
      </option>
    </select>
  </template>
  
  <script>
  import firebaseService from '../method/firebaseService';
  
  export default {
    data() {
      return {
        characters: [],
        selectedCharacter: ''
      };
    },
    created() {
      this.fetchCharacters();
      this.selectedCharacter = localStorage.getItem('selectedCharacterId') || '';
    },
    methods: {
      async fetchCharacters() {
        this.characters = await firebaseService.fetchMyCharacters();
      },
      switchCharacter() {
        localStorage.setItem('selectedCharacterId', this.selectedCharacter);
      }
    }
  };
  </script>
  