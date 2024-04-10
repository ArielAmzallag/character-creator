<template>
    <MainLayout>
      <div class="character-dashboard">
        <aside class="sidebar">
          <h2 class="sidebar-title">My Characters</h2>
          <ul class="character-list">
            <li 
              v-for="character in characters" 
              :key="character.id" 
              :class="{ active: selectedCharacter?.id === character.id }"
              @click="selectCharacter(character)"
            >
              {{ character.name }}
            </li>
          </ul>
        </aside>
        <section v-if="selectedCharacter" class="character-sheet">
          <h2 class="character-name">
            {{ selectedCharacter.name }}
            <button @click="() => updateSimpleField('name')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
          </h2>
          <div v-if="selectedCharacter.alias" class="character-alias">
            <span class="title">Alias:</span>
            <span class="value">{{ selectedCharacter.alias }}</span>
            <button @click="() => updateSimpleField('alias')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
          </div>
          <div v-if="selectedCharacter.gender" class="character-gender">
            <span class="title">Gender:</span>
            <span class="value">{{ selectedCharacter.gender }}</span>
            <button @click="() => updateSimpleField('gender')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
          </div>
          <div v-if="selectedCharacter.universe" class="character-universe">
            <span class="title">Universe:</span>
            <span class="value">{{ selectedCharacter.universe }}</span>
            <button @click="() => updateSimpleField('universe')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
          </div>
          <div v-if="selectedCharacter.description" class="character-description">
            <span class="title">Description:</span>
            <p class="value">{{ selectedCharacter.description }}</p>
            <button @click="() => updateSimpleField('description')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
          </div>
          <div class="character-section character-attributes">
            <h3>Attributes
              <button @click="() => updateMapField('attributes')" class="edit-icon"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
            </h3>
            <div class="attributes-grid">
                <div v-for="(value, key) in selectedCharacter.attributes" :key="key" class="attribute">
                  <div class="attribute-name">{{ getAbbreviation(key) }}</div>
                  <div class="attribute-value">{{ value }}</div>
                </div>
              </div>
          </div>
          <div v-if="selectedCharacter && selectedCharacter.appearance" class="character-appearance">
            <h3>Appearance
              <button @click="() => updateMapField('appearance')" class="edit-icon"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
            </h3>
            <ul>
                <li v-for="attr in formattedAppearance" :key="attr.key">
                  <span class="appearance-attr">{{ attr.key }}</span>: 
                  <span class="appearance-value">{{ attr.value }}</span>
                </li>
              </ul>
          </div>

          <div v-if="selectedCharacter.equipment.length" class="character-equipment">
            <h3>Equipment
              <button @click="() => updateArrayField('equipment')" class="edit-icon"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
            </h3>
            <table class="equipment-table">
                <thead>
                  <tr>
                    <th>Item</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedCharacter.equipment" :key="item">
                    <td>{{ item }}</td>
                  </tr>
                </tbody>
              </table>
          </div>
          
          <div v-if="selectedCharacter.background" class="character-background">
            <h3>Background
                <button @click="() => updateSimpleField('background')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
            </h3>
            <p>{{ selectedCharacter.background }}</p>
          </div>
          <div v-if="selectedCharacter.skills.length" class="character-skills">
            <h3>Skills
              <button @click="() => updateArrayField('skills')" class="edit-icon"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
            </h3>
            <div v-for="skill in selectedCharacter.skills" :key="skill" class="skill-branch">
                <div class="skill-node">
                <div class="skill-icon"></div>
                <div class="skill-name">{{ skill }}</div>
                </div>
            </div>
          </div>
          
          <div v-if="selectedCharacter.notes" class="character-notes">
            <h3>Notes
                <button @click="() => updateSimpleField('notes')"><img src="../assets/svg/edit-icon.svg" alt="Edit" /></button>
            </h3>
            <p>{{ selectedCharacter.notes }}</p>
          </div>
          <div v-if="selectedCharacter.imageUrl" class="character-image-container">
            <img :src="selectedCharacter.imageUrl" alt="Character Image" class="character-image">
          </div>
          <div class="character-visibility">
            <span>This character is <strong>{{ selectedCharacter.isPublic ? 'Public' : 'Private' }}</strong>.</span>
          </div>
          <button @click="deleteCharacter(selectedCharacter.id)" class="delete-character-button">Delete Character</button>
          
        </section>
      </div>
    </MainLayout>
  </template>
  
  

  <script setup>
import MainLayout from '../layout/MainLayout.vue';
import { ref, computed, onUnmounted } from 'vue';
import { getFirestore, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();
const currentEditValues = ref({});
const isEditModalOpen = ref(false);

const characters = ref([]);
const selectedCharacter = ref(null);
const isModalOpen = ref(false);
const currentEditingField = ref('');



const attributeAbbreviations = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
  magic: 'MAG',
  luck: 'LUCK',
};

const formattedAppearance = computed(() => {
  if (!selectedCharacter.value || !selectedCharacter.value.appearance) {
    return [];
  }
  return Object.entries(selectedCharacter.value.appearance).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1");
    const titleCaseKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1).replace(/_/g, " ");
    return { key: titleCaseKey, value };
  });
});

// Async function to update simple fields
const updateSimpleField = async (field, value) => {
  if (!selectedCharacter.value) {
    alert('No character selected.');
    return;
  }

  // Check if the field exists on the object to avoid runtime errors.
  if (!(field in selectedCharacter.value)) {
    console.error(`Field '${field}' does not exist on the selected character.`);
    alert(`Error: Field '${field}' does not exist.`);
    return;
  }

  // No change to the prompting logic here
  const newValue = value || prompt(`Enter new ${field}:`, selectedCharacter.value[field]);
  
  if (newValue !== null && newValue.trim() !== '') {
    // Directly updating the field on the selectedCharacter's value.
    selectedCharacter.value[field] = newValue.trim();
    const characterDocRef = doc(db, 'characters', selectedCharacter.value.id);

    try {
      await updateDoc(characterDocRef, { [field]: newValue.trim() });
      alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Error updating ${field}.`);
    }
  }
};


// Async function to update maps (objects) like attributes and appearance
const updateMapField = async (field) => {
  const currentValuesString = JSON.stringify(selectedCharacter.value[field], null, 2);
  const newValuesString = prompt(`Edit ${field} (JSON format):`, currentValuesString);

  if (newValuesString !== null) {
    try {
      const newValues = JSON.parse(newValuesString);
      // Update local state for reactivity
      selectedCharacter.value[field] = newValues;
      
      // Reference to the Firestore document
      const characterDocRef = doc(db, 'characters', selectedCharacter.value.id);
      
      // Firestore update
      await updateDoc(characterDocRef, { [field]: newValues });
      alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Invalid JSON format for ${field}.`);
    }
  }
};

// Async function to update array fields like equipment and skills
const updateArrayField = async (field) => {
  const currentValuesString = JSON.stringify(selectedCharacter.value[field], null, 2);
  const newValuesString = prompt(`Edit ${field} (JSON array format):`, currentValuesString);

  if (newValuesString !== null) {
    try {
      // Attempt to parse the updated JSON string to an array
      const newValues = JSON.parse(newValuesString);
      
      // Basic validation to ensure the parsed value is indeed an array
      if (Array.isArray(newValues)) {
        // Update local state for reactivity
        selectedCharacter.value[field] = newValues;
        
        // Reference to the Firestore document
        const characterDocRef = doc(db, 'characters', selectedCharacter.value.id);
        
        // Firestore update
        await updateDoc(characterDocRef, { [field]: newValues });
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`);
      } else {
        throw new Error('Input is not a valid array.');
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Invalid JSON format for ${field}. Make sure it is a valid JSON array.`);
    }
  }
};

function getAbbreviation(attribute) {
  return attributeAbbreviations[attribute.toLowerCase()] || attribute;
}

const selectCharacter = (character) => {
  console.log("Character selected:", character);
  console.log("Selected Character ID:", selectedCharacter.value?.id);
  selectedCharacter.value = character;
};

let unsubscribe;
onAuthStateChanged(auth, user => {
  if (user) {
    // Query to get the characters created by the logged-in user
    const q = query(collection(db, 'characters'), where('createdBy', '==', user.uid));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      characters.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }, error => {
      console.error("Error fetching characters: ", error);
    });
  } else {
    // Clear characters if there is no user
    characters.value = []; 
  }
});

// Function to delete a selected character
const deleteCharacter = async (characterId) => {
  console.log('Attempting to delete character with ID:', characterId);
  if (!characterId) {
    alert('No character selected or character ID is undefined.');
    return;
  }
  if (confirm('Are you sure you want to delete this character?')) {
    try {
    await deleteDoc(doc(db, 'characters', characterId));
    alert('Character deleted successfully');
    

    characters.value = characters.value.filter(character => character.id !== characterId);
    location.reload()
  } catch (error) {
    console.error("Error deleting character:", error);
    alert(`There was an error: ${error.message}`);
  }
  }
};

// Cleanup the listener when the component unmounts
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }


});

</script>

<style lang="scss" scoped>
.character-dashboard {
    display: flex;
    max-width: 95%;
    margin: 40px auto;
    color: var(--text-color);
  
    .sidebar {
      width: 250px;
      background: var(--background-color);
      padding: var(--spacing-base);
      border-right: 1px solid var(--border-color);
  
      .sidebar-title {
        color: var(--accent-color);
        margin-bottom: var(--spacing-base);
        font-size: var(--font-size-lg);
        text-align: center;
      }
  
      .character-list {
        list-style: none;
        padding: 0;
        margin: 0;
  
        li {
          padding: var(--spacing-sm);
          color: var(--text-color);
          cursor: pointer;
          border-radius: var(--border-radius);
          margin-bottom: var(--spacing-sm);
          transition: background-color 0.3s, color 0.3s;
  
          &.active, &:hover {
            background-color: var(--primary-color);
            color: var(--background-color);
          }
        }
      }
    }
  
    .character-sheet {
      flex-grow: 1;
      padding: var(--spacing-base);
      background: var(--background-light);
      border-radius: var(--border-radius);
      margin-left: var(--spacing-base);
      overflow-y: auto;
      font-family: 'Merriweather', serif;
      line-height: 1.6;
      font-size: var(--font-size-base);
      color: var(--primary-color);

        
      h3 {
        color: var(--accent-color);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: var(--spacing-sm);
      }
  
      h2.character-name {
        color: var(--primary-color);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-base);
      }
  
      .character-section {
        margin-bottom: var(--spacing-lg);

        border-radius: var(--border-radius);

  
        .character-info {
          display: flex;
          flex-wrap: wrap;
          margin: -0.5rem;
  
          .info-group {
            padding: 0.5rem;
            flex: 1 1 50%;
  
            .title {
              display: block;
              font-weight: bold;
              color: var(--accent-color);
              margin-bottom: 0.25rem;
            }
  
            .value {
              color: var(--text-color);
              font-size: var(--font-size-sm);
            }
          }
        }
  
        .attributes-grid {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-base);
          
            .attribute {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: var(--spacing-sm);
              width: calc(100% / 8 - 20px);
              border: 1px solid var(--border-color);
              border-radius: var(--border-radius);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
              margin-bottom: var(--spacing-base);
          
              .attribute-name {
                font-weight: bold;
                margin-bottom: var(--spacing-sm);
              }
          
              .attribute-value {
                font-size: var(--font-size-lg);
                font-weight: bold;
              }
            }
          }
          
          .character-appearance {
            h3 {
              font-weight: bold;
              color: var(--accent-color);
              margin-bottom: var(--spacing-base);
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          
            ul {
              list-style-type: none;
              padding: 0;
              margin: 0;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
              gap: var(--spacing-sm);
            }
          
            li {
              background: var(--background-color-dark);
              color: var(--text-color);
              border: 1px solid var(--border-color);
              border-radius: var(--border-radius);
              padding: var(--spacing-sm);
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
              margin-bottom: var(--spacing-base);
              &:hover {
                transform: translateY(-5px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              }
            }
          
            .appearance-attr {
              font-weight: bold;
              margin-bottom: 0.25rem;
              text-transform: capitalize;
              color: var(--text-light);
            }
          
            .appearance-value {
              color: var(--text-light);
              font-size: var(--font-size-base);
            }
          }
          
          
        .skills-list {
          margin: var(--spacing-sm) 0;
          padding: 0;
          list-style-type: none;
  
          li {
            background: var(--background-color);
            padding: var(--spacing-sm);
            border-radius: var(--border-radius);
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        }

        .character-equipment {
            h3 {
              font-weight: bold;
              color: var(--accent-color);
              margin-bottom: var(--spacing-base);
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          
            .equipment-table {
              width: 100%;
              border-collapse: collapse;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              background: var(--background-color-dark);
              border-radius: var(--border-radius);
              overflow: hidden;
          
              th {
                background: var(--primary-color);
                color: var(--background-light);
                padding: var(--spacing-sm) var(--spacing-base);
                font-size: var(--font-size-base);
                letter-spacing: 0.5px;
                text-align: left;
              }
          
              td {
                background: var(--background-color);
                color: var(--text-color);
                padding: var(--spacing-sm);
                border-top: 1px solid var(--background-color-lighter);
                transition: background-color 0.3s ease;
          
                &:hover {
                  background-color: var(--primary-hover);
                  color: var(--background-light);
                }
              }
          
              tbody tr:first-child td {
                border-top: none;
              }
            }
          }    
      }
      

      
      /* To place the edit button next to section titles */
      h3 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .edit-button {
          margin-top: 0;
        }
      }
      
      
      .character-image-container {
        text-align: center;
        margin-top: var(--spacing-base);
  
        img {
          max-width: 100%;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      }
  
      .character-visibility {
        text-align: center;
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-base);
        font-weight: bold;
      }
    }
  }
  
  @media (max-width: var(--breakpoint-lg)) {
    .character-dashboard {
      flex-direction: column;
  
      .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
      }
  
      .character-sheet {
        margin-left: 0;
        margin-top: var(--spacing-base);
      }
    }
  }
  </style>
  