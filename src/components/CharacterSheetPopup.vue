<template>
    <div class="character-sheet-popup" v-if="visible">
      <div class="popup-overlay" @click="close"></div>
      <div class="popup-content">
        <button class="close-button" @click="close">&times;</button>
        <div class="character-details">
            <div v-if="character.imageUrl" class="character-image-container">
                <img :src="character.imageUrl" alt="Character Image" class="character-image"/>
              </div>
              
        <h2>{{ character.name }}</h2>
        <div v-if="character.alias"><strong>Alias:</strong> {{ character.alias }}</div>
        <div v-if="character.gender"><strong>Gender:</strong> {{ character.gender }}</div>
        <div v-if="character.universe"><strong>Universe:</strong> {{ character.universe }}</div>
        <div v-if="character.description"><strong>Description:</strong> {{ character.description }}</div>
        <div v-if="character.attributes" class="character-section character-attributes">
          <h3>Attributes</h3>
          <div class="attributes-grid">
            <div v-for="(value, key) in character.attributes" :key="key" class="attribute">
              <div class="attribute-name">{{ key }}</div>
              <div class="attribute-value">{{ value }}</div>
            </div>
          </div>
        </div>
        <div v-if="character.appearance" class="character-appearance">
          <h3>Appearance</h3>
          <ul>
            <li v-for="(value, key) in character.appearance" :key="key">
              <span class="appearance-attr">{{ key }}</span>: 
              <span class="appearance-value">{{ value }}</span>
            </li>
          </ul>
        </div>
        <div v-if="character.equipment && character.equipment.length" class="character-equipment">
          <h3>Equipment</h3>
          <ul>
            <li v-for="item in character.equipment" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div v-if="character.background" class="character-background">
          <h3>Background</h3>
          <p>{{ character.background }}</p>
        </div>
        <div v-if="character.skills && character.skills.length" class="character-skills">
          <h3>Skills</h3>
          <ul>
            <li v-for="skill in character.skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
        <div v-if="character.notes" class="character-notes">
          <h3>Notes</h3>
          <p>{{ character.notes }}</p>
        </div>
        </div>
      </div>
    </div>
  </template>
    
  <script>
  export default {
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        visible: true,
      };
    },
    methods: {
      close() {
        this.visible = false;
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .character-sheet-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: var(--primary-color);
  
    .popup-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
    
    .popup-content {
      position: relative;
      padding: 20px;
      background: var(--background-light); /* Assuming this is a lighter color */
      border-radius: var(--border-radius);
      max-width: 800px; /* Adjusted for potential image width */
      z-index: 2;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 90vh;
    }
    
    .character-image-container {
      text-align: center;
      .character-image {
        max-width: 100%;
        height: auto;
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-base);
      }
    }
    
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      border: none;
      background: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  
  body {
    font-family: var(--font-family);
    line-height: var(--line-height);
    font-weight: var(--font-weight);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--text-color);
  }
  
  h2 {
    color: var(--primary-color);
    font-size: var(--font-size-lg);
  }
  
  p {
    font-size: var(--font-size-base);
    margin-top: var(--spacing-base);
    color: var(--text-dark);
  }
  

  @media (max-width: var(--breakpoint-md)) {
    .popup-content {
      padding: var(--spacing-base);
      max-width: 90%;
    }
  }
  
  </style>
  