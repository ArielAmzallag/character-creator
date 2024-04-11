<template>
  <div>
    <select v-model="selectedCharacterId" @change="updateSelectedCharacter">
      <option v-for="character in characters" :key="character.id" :value="character.id">
        {{ character.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      characters: [],
      selectedCharacterId: '',
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    async fetchCharacters() {
      try {
        const response = await fetch('https://example.com/api/characters');
        if (response.ok) {
          this.characters = await response.json();
        } else {
          throw new Error('Failed to fetch characters');
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    },
    updateSelectedCharacter() {
    // Assuming you have an API endpoint to update the user's current character
    const apiUrl = 'https://example.com/api/users/updateCharacter';

    // Payload to send. This would include the ID of the selected character.
    const payload = {
      selectedCharacterId: this.selectedCharacterId,
    };

    // Example using the Fetch API to send the selected character ID to your server.
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization header if your API requires authentication
        'Authorization': `Bearer ${this.userAuthToken}`,
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (response.ok) {
        console.log('Character updated successfully');
        // Handle any additional tasks after successful update
      } else {
        throw new Error('Failed to update character');
      }
    })
    .catch(error => {
      console.error('Error updating character:', error);
    });
  },
  },
};
</script>

