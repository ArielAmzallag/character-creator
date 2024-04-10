<template>
    <MainLayout>
      <div class="character-explorer">
        <aside class="filter-search">
            <input type="text" v-model="searchQuery" placeholder="Search characters..." class="search-bar"/>

            <!-- Sorting Options -->
            <select v-model="sortOrder">
                <option value="asc">Likes Ascending</option>
                <option value="desc">Likes Descending</option>
            </select>
            
            <!-- Filter by Gender -->
            <select v-model="filterGender">
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            
            <!-- Filter by Universe -->
            <select v-model="filterUniverse">
              <option value="">Any Universe</option>
              <option v-for="universe in uniqueUniverses" :key="universe" :value="universe">{{ universe }}</option>
            </select>
            
            <!-- Filter by Skills (example of multi-select) -->
            <select v-model="filterSkills" multiple>
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
  
  // Auth state change handling to track the current user
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
  const skills = new Set(characters.value.flatMap(character => character.skills || []));
  return Array.from(skills);
});
  

// Modified part of the script
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

  
  // Check if the current user has liked the characters
  const checkUserLikes = async (chars) => {
  for (const character of chars) {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('characterId', '==', character.id), where('userId', '==', currentUser.value.uid));
    const querySnapshot = await getDocs(q);
    character.isLikedByCurrentUser = !querySnapshot.empty;
  }
  // Force update to ensure reactivity
  characters.value = [...chars];
};
  
const toggleLikeCharacter = async (character) => {
  const characterDocRef = doc(db, 'characters', character.id);
  const likesRef = collection(db, 'likes');
  const q = query(likesRef, where('characterId', '==', character.id), where('userId', '==', currentUser.value.uid));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // Like the character
    await addDoc(likesRef, { characterId: character.id, userId: currentUser.value.uid });
    await updateDoc(characterDocRef, { likeCount: increment(1) });
    character.likeCount = (character.likeCount || 0) + 1;
  } else {
    // Unlike the character
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'likes', docSnapshot.id));
    });
    await updateDoc(characterDocRef, { likeCount: increment(-1) });
    character.likeCount = (character.likeCount || 0) - 1;
  }

  // Toggle like status in local state for immediate UI update
  character.isLikedByCurrentUser = !character.isLikedByCurrentUser;

  // Ensure reactivity by updating the characters array
  characters.value = characters.value.map(c => c.id === character.id ? { ...c, isLikedByCurrentUser: character.isLikedByCurrentUser, likeCount: character.likeCount } : c);
};



  
  // Selecting a character to view in the popup
  const selectCharacter = (character) => {
    selectedCharacter.value = character;
  };
  
  // Computed property to filter characters based on search query and other filters
  const filteredCharacters = computed(() => {
  return characters.value
    .filter(character => {
      const matchesQuery = character.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesGender = filterGender.value ? character.gender === filterGender.value : true;
      const matchesUniverse = filterUniverse.value ? character.universe === filterUniverse.value : true;
      const matchesSkills = filterSkills.value.length ? filterSkills.value.every(skill => character.skills?.includes(skill)) : true;
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
      gap: 1rem; // Ensures consistent spacing between elements
      border-right: 2px solid #ddd;
      justify-content: flex-start;
      overflow-y: auto; 
  
      input, select {
        padding: 0.5rem;
        border: 1px solid #ccc; // Subtle border
        border-radius: 0.25rem; // Rounded corners for a modern look
        font-size: 1rem; // Larger font size for better readability
        width: 100%; // Ensures full width
        box-sizing: border-box; // Includes padding and border in the element's total width and height
  
        &:focus {
          border-color: #007bff; // Highlight focus for better accessibility
          outline: none; // Removes the default focus outline
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); // Subtle glow effect
        }
      }
  
      select[multiple] {
        height: auto; // Adjust height based on content
        min-height: 100px; // Minimum height to show multiple options
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
          border-bottom: 1px solid #eee; // Adds a subtle divider between items
  
          &:last-child {
            border-bottom: none; // Removes divider from the last item
          }
  
          div {
            cursor: pointer;
            transition: color 0.2s ease-in-out;
          }
  
          .like-icon {
            cursor: pointer;
            width: 24px; // Adjust as per icon size
            height: 24px; // Adjust as per icon size


  
            img {
              width: 100%;
              height: auto;
            }
          }
        }

        .creator-info {
            color: #555; /* A lighter shade for less emphasis */
            font-size: 0.8rem; /* A smaller font size */
            margin-top: 0.5rem; /* Add some space between the name and the creator info */
          }
          
      }
    }
  }
  
  
</style>
