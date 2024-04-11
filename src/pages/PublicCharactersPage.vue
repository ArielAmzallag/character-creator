<template>
    <MainLayout>
      <div class="character-explorer">
        <aside class="filter-search">
            <input type="text" v-model="searchQuery" placeholder="Search characters..." class="search-bar"/>

            <select v-model="sortOrder">
                <option value="asc">Likes Ascending</option>
                <option value="desc">Likes Descending</option>
            </select>
            
            <select v-model="filterGender">
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            
            <select v-model="filterUniverse">
              <option value="">Any Universe</option>
              <option v-for="universe in uniqueUniverses" :key="universe" :value="universe">{{ universe }}</option>
            </select>
            
            <select v-model="filterSkills">
              <option value="">Any Skill</option>
              <option v-for="skill in uniqueSkills" :key="skill" :value="skill">{{ skill }}</option>
            </select>              
          </aside>
          
          <div class="character-list">
            <ul>
                <li v-for="character in filteredCharacters" :key="character.id">
                    <div @click="selectCharacter(character)">
                      <strong>{{ character.name }}</strong>
                      <span>(Likes: {{ character.likeCount || 0 }})</span>
                      <div class="creator-info">
                        Created by: {{ character.creatorName || 'The Unknown One' }}
                      </div>
                    </div>
                    <button @click.stop="toggleLikeCharacter(character)" class="like-button">
                        <img src="../assets/svg/full-like.svg" alt="Liked"/>
                    </button>
              </li>
            </ul>
          </div>
          
          
          
        <CharacterSheetPopup v-if="selectedCharacter" :character="selectedCharacter" @close="selectedCharacter = null"/>
      </div>
    </MainLayout>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, getDocs, increment, getDoc, } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import MainLayout from "../layout/MainLayout.vue";
  import CharacterSheetPopup from "../components/CharacterSheetPopup.vue";
  
  const db = getFirestore();
  const auth = getAuth();
  const characters = ref([]);
  const selectedCharacter = ref(null);
  const searchQuery = ref('');
  const filterGender = ref('');
  const filterUniverse = ref('');
  const filterSkills = ref([]); 
  const currentUser = ref(null);
  const sortOrder = ref('asc');
  const userDoc = ref(null);
  
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user ? user : null;
    if (user) {
    }
  });

  const uniqueUniverses = computed(() => {
  const universes = new Set(characters.value.map(character => character.universe));
  return Array.from(universes);
});

const uniqueSkills = computed(() => {
  const skills = new Set(characters.value.flatMap(character => character.skills));
  return Array.from(skills).filter(skill => skill); // Ensure empty strings are not included
});
  

onMounted(() => {
  const q = query(collection(db, 'characters'), where('isPublic', '==', true));
  onSnapshot(q, (querySnapshot) => {
    const chars = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        creatorName: data.creatorName || 'The Unknown One',
        isLikedByCurrentUser: false,
      };

    });



    characters.value = chars;
      checkUserLikes(chars);
  });
});

  
  const checkUserLikes = async (chars) => {
  for (const character of chars) {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('characterId', '==', character.id), where('userId', '==', currentUser.value.uid));
    const querySnapshot = await getDocs(q);
    character.isLikedByCurrentUser = !querySnapshot.empty;
  }
  characters.value = [...chars];
};
  
const toggleLikeCharacter = async (character) => {
  const characterDocRef = doc(db, 'characters', character.id);
  const likesRef = collection(db, 'likes');
  const q = query(likesRef, where('characterId', '==', character.id), where('userId', '==', currentUser.value.uid));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    await addDoc(likesRef, { characterId: character.id, userId: currentUser.value.uid });
    await updateDoc(characterDocRef, { likeCount: increment(1) });
    character.likeCount = (character.likeCount || 0) + 1;
  } else {
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'likes', docSnapshot.id));
    });
    await updateDoc(characterDocRef, { likeCount: increment(-1) });
    character.likeCount = (character.likeCount || 0) - 1;
  }

  character.isLikedByCurrentUser = !character.isLikedByCurrentUser;

  characters.value = characters.value.map(c => c.id === character.id ? { ...c, isLikedByCurrentUser: character.isLikedByCurrentUser, likeCount: character.likeCount } : c);
};


  const selectCharacter = (character) => {
    selectedCharacter.value = character;
  };
  
  const filteredCharacters = computed(() => {
  return characters.value
    .filter(character => {
      const matchesQuery = character.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesGender = filterGender.value ? character.gender === filterGender.value : true;
      const matchesUniverse = filterUniverse.value ? character.universe === filterUniverse.value : true;
      let matchesSkills = true;
      if (filterSkills.value !== "") { // Checks if a specific skill is selected
        matchesSkills = character.skills?.includes(filterSkills.value);
      }

      return matchesQuery && matchesGender && matchesUniverse && matchesSkills;
    })
    .sort((a, b) => sortOrder.value === 'asc' ? a.likeCount - b.likeCount : b.likeCount - a.likeCount); // Sort based on sortOrder
});
  </script>
  

<style lang="scss" scoped>
button{
    background: none ;
}
.character-explorer {
    display: flex;
    flex-direction: row;
    height: 100vh;
  
    .filter-search {
      width: 20%;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-right: 2px solid #ddd;
      justify-content: flex-start;
      overflow-y: auto; 
  
      input, select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
  
        &:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      }
  
      select[multiple] {
        height: auto;
        min-height: 100px;
      }
    }
  
    .character-list {
      width: 80%;
      overflow-y: auto;
      flex-direction: column;
      ul {
        list-style-type: none;
        padding: 0;
  
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
  
          &:last-child {
            border-bottom: none;
          }
  
          div {
            cursor: pointer;
            transition: color 0.2s ease-in-out;
          }
  
          .like-icon {
            cursor: pointer;
            width: 24px;
            height: 24px;


  
            img {
              width: 100%;
              height: auto;
            }
          }
        }

        .creator-info {
            color: #555;
            font-size: 0.8rem;
            margin-top: 0.5rem;
          }
          
      }
    }
  }
  
  
</style>
