<template>
  <MainLayout>
    <h1>Explore Characters</h1>
    <div class="characters-grid">
      <div class="character-card" v-for="character in randomCharacters" :key="character.id">
        <img :src="character.imageUrl" :alt="character.name" class="character-image">
        <h2>{{ character.name }}</h2>
        <p>{{ character.description }}</p>
        <a :href="`/characters/${character.id}`">Learn More</a>
      </div>
    </div>
    <p>Discover your favorite characters from stories, video games, tabletop RPGs, and more.</p>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layout/MainLayout.vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const db = getFirestore();
const characters = ref([]);
const randomCharacters = ref([]);

// Fetch all public characters and randomly pick two
const loadRandomCharacters = async () => {
  const q = query(collection(db, 'characters'), where('isPublic', '==', true));
  const querySnapshot = await getDocs(q);
  const allCharacters = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      detailLink: `/characters/${doc.id}`
    };
  });
  // Randomly pick two characters
  for (let i = 0; i < 2 && allCharacters.length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    randomCharacters.value.push(allCharacters[randomIndex]);
    allCharacters.splice(randomIndex, 1); // Remove the picked character
  }
};

onMounted(loadRandomCharacters);
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
