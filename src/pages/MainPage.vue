<template>
  <MainLayout>
    <h1>Explore Characters</h1>
    <div class="characters-grid">
      <div class="character-card" v-for="character in characters" :key="character.id">
        <img :src="character.imageUrl" :alt="character.name" class="character-image">
        <h2>{{ character.name }}</h2>
        <p>{{ character.description }}</p>
        <a :href="character.detailLink">Learn More</a>
      </div>
    </div>
    <p>Discover your favorite characters from stories, video games, tabletop RPGs, and more.</p>
  </MainLayout>
</template>


<script setup>
import { ref } from 'vue'
import MainLayout from '../layout/MainLayout.vue'

// Use the `new URL` syntax for importing static assets with Vite
const aerithImage = new URL('../assets/img/aerith.png', import.meta.url).href;
const geraltImage = new URL('../assets/img/geralt.png', import.meta.url).href;

const characters = ref([
  {
    id: 1,
    name: 'Aerith Gainsborough',
    description: 'A kind and caring florist from Final Fantasy VII, with a mysterious past.',
    imageUrl: aerithImage,
    detailLink: '/characters/aerith'
  },
  {
    id: 2,
    name: 'Geralt of Rivia',
    description: 'A monster hunter for hire from The Witcher series, known as the White Wolf.',
    imageUrl: geraltImage,
    detailLink: '/characters/geralt'
  },
  // Add more characters as needed
])
</script>


<style lang="scss" scoped>
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
  align-items: stretch;
  margin: 20px;
}

.character-card {
  display: flex;
  flex-direction: column;
  background-color: var(--primary-color, #007bff);
  color: var(--text-light, #ffffff);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  .character-image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .character-info {
    padding: 15px;
    text-align: left;

    h2 {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      color: var(--secondary-color, #6c757d);
    }

    p {
      font-size: 0.9em;
      margin-bottom: 1em;
    }

    a {
      color: var(--accent-color, #ffc107);
      text-decoration: none;
      font-weight: bold;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
