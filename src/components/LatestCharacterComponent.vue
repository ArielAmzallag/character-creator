<template>
    <div class="latest-characters">
        <h2>Latest Characters</h2>
        <ul>
          <li v-for="character in latestCharacters" :key="character.id">
            <h3>{{ character.name }}</h3>
            <p>By {{ character.creatorName }} - {{ character.universe }}</p>
            <p>{{ character.description }}</p>
          </li>
        </ul>
      </div>
  </template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

  const db = getFirestore();
  const latestCharacters = ref([]);

  const fetchLatestCharacters = async () => {
try {
  const charactersQuery = query(collection(db, 'characters'), orderBy('creationDate', 'desc'), limit(5));
  const querySnapshot = await getDocs(charactersQuery);
  console.log("Number of documents fetched: ", querySnapshot.docs.length);
  latestCharacters.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} catch (error) {
  console.error("Error fetching latest characters: ", error);
}
};

onMounted(fetchLatestCharacters);
</script>