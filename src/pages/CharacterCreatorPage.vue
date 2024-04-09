<template>
  <MainLayout>
    <div class="character-creation-form">
      <h2>Create Your Character</h2>
      <div class="input-group">
        <label for="character-name">Character Name</label>
        <input type="text" id="character-name" v-model="character.name" placeholder="Enter character name" required />
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
      <button @click="showOptionalFields = !showOptionalFields">{{ showOptionalFields ? 'Hide' : 'Show' }} Optional Fields</button>
      <div v-if="showOptionalFields">
        <div class="input-group">
          <label for="character-alias">Alias</label>
          <input type="text" id="character-alias" v-model="character.alias" placeholder="Enter alias (optional)" />
        </div>
        <div class="input-group">
          <label for="character-universe">Universe</label>
          <input type="text" id="character-universe" v-model="character.universe" placeholder="Enter universe or game name" />
        </div>
        <div class="input-group">
          <label for="character-description">Description</label>
          <textarea id="character-description" v-model="character.description" placeholder="Describe your character"></textarea>
        </div>
        <div class="section">
          <h3>Attributes</h3>
          <div class="input-group" v-for="attr in Object.keys(character.attributes)" :key="attr">
            <label :for="attr">{{ attr }}</label>
            <input type="number" :id="attr" v-model="character.attributes[attr]" />
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
    isPublic: false
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
  
    await uploadCharacterImage();
    character.value.creatorName = auth.currentUser.displayName || "Anonymous";
    character.value.creationDate = new Date().toISOString();
    character.value.createdBy = auth.currentUser.uid;
    character.value.likeCount = 0;
  
    await addDoc(collection(db, 'characters'), character.value).then(() => {
      alert('Character created successfully!');
    }).catch(error => {
      console.error("Error adding character: ", error);
    });
  };
  </script>
      
    <style lang="scss" scoped>
    .character-creation-form {
        max-width: 800px;
        margin: 40px auto;
        padding: var(--spacing-base);
        background: var(--background-color);
        border-radius: var(--border-radius);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        color: var(--text-color);
      
        h2 {
          text-align: center;
          color: var(--accent-color);
          margin-bottom: var(--spacing-base);
        }
      
        .section {
          border-bottom: 2px solid var(--border-color);
          padding-bottom: var(--spacing-base);
          margin-bottom: var(--spacing-base);
      
          h3 {
            color: var(--accent-color);
            margin-bottom: 15px;
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
      
          label {
            flex-basis: 100%;
            margin-bottom: 5px;
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
      
            &:focus {
              outline: 2px solid var(--accent-color);
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
              background-color: var(--primary-hover);
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
      
        button.add-item {
          background-color: var(--secondary-color);
          margin-bottom: 15px;
          &:hover {
            background-color: var(--secondary-color-dark);

          }
        }
      
        button.submit {
          display: block;
          width: 100%;
          padding: 12px 0;
          border: none;
          background-color: var(--accent-color);
          color: var(--text-color);
          font-size: var(--font-size-base);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: background 0.3s ease;
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