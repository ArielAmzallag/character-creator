<template>
  <MainLayout>
    <div class="character-creation-form">
      <h2>Create Your Character</h2>
      <div class="input-group">
        <label for="character-name">Character Name</label>
        <input type="text" id="character-name" v-model="character.name" placeholder="Enter character name" required />
      </div>
      <button @click="showOptionalFields = !showOptionalFields">{{ showOptionalFields ? 'Hide' : 'Show' }} Optional Fields</button>
      <div v-if="showOptionalFields">
        <div class="input-group">
          <label for="character-alias">Alias</label>
          <input type="text" id="character-alias" v-model="character.alias" placeholder="Enter alias (optional)" />
        </div>
        <div class="input-group">
          <label for="character-gender">Gender</label>
          <select id="character-gender" v-model="character.gender">
            <option disabled value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-Binary</option>
          </select>
        </div>
        <div class="input-group">
          <label for="character-universe">Universe</label>
          <input type="text" id="character-universe" v-model="character.universe" placeholder="Enter universe or game name" />
        </div>
        <div class="input-group">
          <label for="character-description">Description</label>
          <textarea id="character-description" v-model="character.description" placeholder="Describe your character"></textarea>
        </div>
        <div class="section attributes-section">
          <h3>Attributes</h3>
          <div class="attributes-container">
            <div class="attribute" v-for="(value, key) in character.attributes" :key="key">
              <label :for="'attribute-' + key">{{ key }}</label>
              <input type="number" :id="'attribute-' + key" v-model="character.attributes[key]" />
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>Appearance</h3>
          <div class="input-group" v-for="appearanceAttr in Object.keys(character.appearance)" :key="appearanceAttr">
            <label :for="appearanceAttr">{{ appearanceAttr }}</label>
            <input type="text" :id="appearanceAttr" v-model="character.appearance[appearanceAttr]" />
          </div>
        </div>
        <div class="input-group">
          <label for="character-background">Background</label>
          <textarea id="character-background" v-model="character.background" placeholder="Character's background or history"></textarea>
        </div>
        <div class="section">
          <h3>Equipment</h3>
          <div v-for="(item, index) in character.equipment" :key="index" class="input-group">
            <input type="text" v-model="character.equipment[index]" placeholder="Item name" />
            <button @click="removeEquipment(index)">Remove</button>
          </div>
          <button @click="addEquipment">Add Equipment</button>
        </div>
        <div class="section">
          <h3>Skills</h3>
          <div v-for="(skill, index) in character.skills" :key="index" class="input-group">
            <input type="text" v-model="character.skills[index]" placeholder="Skill name" />
            <button @click="removeSkill(index)">Remove</button>
          </div>
          <button @click="addSkill">Add Skill</button>
        </div>
        <div class="input-group">
          <label for="character-notes">Notes</label>
          <textarea id="character-notes" v-model="character.notes" placeholder="Additional notes about the character"></textarea>
        </div>
      </div>
      <div class="input-group">
        <label for="character-image">Character Image</label>
        <input type="file" id="character-image" @change="onFileChange" required />
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="make-character-public" v-model="character.isPublic" />
        <label for="make-character-public">Make character public</label>
      </div>
      <button @click="createCharacter">Create Character</button>
    </div>
  </MainLayout>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import MainLayout from '../layout/MainLayout.vue';

  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();
  const showOptionalFields = ref(false);
  
  const character = ref({
    name: '',
    gender: '',
    alias: '',
    universe: '',
    description: '',
    attributes: {
      strength: 10,
      intelligence: 10,
      wisdom: 10,
      dexterity: 10,
      constitution: 10,
      charisma: 10,
      magic: 0,
      luck: 5
    },
    appearance: {
      height: '',
      weight: '',
      hairColor: '',
      eyeColor: '',
      skinTone: '',
      build: '',
      distinguishingFeatures: '',
      generalAppearance: ''
    },
    background: '',
    equipment: [''],
    skills: [''],
    notes: '',
    imageUrl: '',
    isPublic: null
  });
  
  const characterImage = ref(null);
  
  const onFileChange = (e) => {
    characterImage.value = e.target.files[0];
  };
  
  const uploadCharacterImage = async () => {
    if (characterImage.value) {
      const fileRef = storageRef(storage, `characterImages/${characterImage.value.name}`);
      await uploadBytes(fileRef, characterImage.value).then(async snapshot => {
        character.value.imageUrl = await getDownloadURL(snapshot.ref);
      });
    }
  };

  
  
  const addEquipment = () => {
    character.value.equipment.push('');
  };
  
  const removeEquipment = (index) => {
    character.value.equipment.splice(index, 1);
  };
  
  const addSkill = () => {
    character.value.skills.push('');
  };
  
  const removeSkill = (index) => {
    character.value.skills.splice(index, 1);
  };
  
  const createCharacter = async () => {
    if (!auth.currentUser) {
      alert('You must be logged in to create a character.');
      return;
    }
    
  // Validate required fields
  if (!character.value.name.trim()) {
    alert('Character name is required.');
    return;
  }
  if (!characterImage.value) {
    alert('Character image is required.');
    return;
  }

  if (character.value.isPublic === null) {
    alert('Please choose whether to make your character public.');
    return;
  }
  

    await uploadCharacterImage();
    character.value.creatorName = auth.currentUser.displayName || "Anonymous";
    character.value.creationDate = new Date().toISOString();
    character.value.createdBy = auth.currentUser.uid;
    character.value.likeCount = 0;
  
    await addDoc(collection(db, 'characters'), character.value)
      .then(() => {
        alert('Character created successfully!');
      })
      .catch(error => {
        console.error("Error adding character: ", error);
        alert("Failed to create character.");
      });

  };
  </script>
      
    <style lang="scss" scoped>
    .character-creation-form {
      max-width: 800px;
      margin: 40px auto;
      padding: var(--spacing-base);
      background: linear-gradient(145deg, var(--background-color), var(--background-color-lighter));
      border-radius: var(--border-radius);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      color: var(--text-color);
    
      h2 {
        text-align: center;
        color: var(--accent-color);
        margin-bottom: var(--spacing-base);
        font-size: var(--font-size-lg);
      }
    
      .section {
        border-bottom: 2px dashed var(--border-color);
        padding-bottom: var(--spacing-base);
        margin-bottom: var(--spacing-base);
        border-radius: var(--border-radius);
    
        h3 {
          color: var(--accent-color);
          margin-bottom: 15px;
          font-size: var(--font-size-base);
        }
    
        &:last-child {
          border-bottom: none;
        }
      }
    
      .input-group, .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: var(--spacing-base);
        position: relative;
    
        label {
          flex-basis: 100%;
          margin-bottom: 5px;
          color: var(--accent-color);
          font-weight: bold;
        }
    
        input[type="text"],
        select,
        textarea,
        input[type="number"] {
          flex: 1 1 45%;
          padding: 12px;
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          background-color: var(--background-light);
          color: var(--text-dark);
          font-size: var(--font-size-base);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    
          &:focus {
            outline: 2px solid var(--accent-color);
            box-shadow: 0 0 0 2px var(--accent-color);
          }
        }
    
        input[type="file"] {
          flex-basis: 100%;
          border: none;
          color: var(--text-color);
          margin-top: var(--spacing-base);
        }
    
        textarea {
          height: 150px;
          flex-basis: 100%;
        }
    
        .btn-remove {
          margin-left: 10px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          &:hover {
            background-color: var(primary-color-dark);
          }
        }
      }
    
      .checkbox-group {
        flex-basis: 100%;
        align-items: center;
        label {
          margin-left: 10px;
        }
      }
    
      button {
        padding: 12px 0;
        border: none;
        color: white;
        font-size: var(--font-size-base);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
    
        &.add-item {
          background-color: var(--secondary-color);
          &:hover {
            background-color: var(--secondary-color-dark);
          }
        }
    
        &.submit {
          width: 100%;
          background-color: var(--accent-color);
          &:hover {
            background-color: var(--primary-hover);
          }
        }
      }
    
      .attributes-section {
        display: flex;
        flex-direction: column;
        align-items: left;
    
        .attributes-container {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          width: 100%;

    
          .attribute {
            display: flex;
            flex-direction: column;
            width: calc(100% / 8 - 10px);
            margin-bottom: var(--spacing-base);
    
            label {
              color: var(--background-light);
              font-size: var(--font-size-sm);
            }
    
            input {
              padding: 0.5rem;
              border-radius: var(--border-radius);
              border: 1px solid var(--border-color);
              background-color: var(--background-light);
              color: var(--text-dark);
              text-align: center;
    
              &:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 2px var(--accent-color);
              }
            }
          }
        }
      }
      @media (max-width: var(--breakpoint-md)) {
        .input-group input[type="text"],
        .input-group select,
        .input-group textarea,
        .input-group input[type="number"] {
          flex-basis: 100%; 
        }
      }
    }
    
    </style>