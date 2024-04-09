import admin from 'firebase-admin';
import serviceAccount from './character-creator-26852-firebase-adminsdk-4z4jb-06ea184679.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://character-creator-26852-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();


const characterData = {

        "CharacterID": "unique_character_id",
        "Name": "Character Name",
        "Gender": "Male",
        "Alias": "Character Alias",
        "CreationDate": "2024-04-09T00:00:00Z",
        "CreatedBy": "user_id",
        "Universe": "Universe or Game Name",
        "Description": "A brief description of the character.",
        "Attributes": {
          "Strength": 10,
          "Intelligence": 10,
          "Wisdom": 10,
          "Dexterity": 10,
          "Constitution": 10,
          "Charisma": 10,
          "Magic": 0,
          "Luck": 5
        },
        "Appearance": {
          "Height": "6ft",
          "Weight": "180lbs",
          "HairColor": "Black",
          "EyeColor": "Brown",
          "SkinTone": "Fair",
          "Build": "Muscular",
          "DistinguishingFeatures": "Scar on left cheek",
          "GeneralAppearance": "Brief general description of appearance."
        },
        "Background": "Character background or history.",
        "Equipment": [
          "Sword",
          "Shield",
          "Healing Potion"
        ],
        "Skills": [
          "Swordsmanship",
          "Alchemy",
          "Stealth"
        ],
        "Status": "Active",
        "Notes": "Additional notes about the character.",
        "LikeCount": 0,
        "IsPublic": false

      
};

db.collection('characters').add(characterData)
  .then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
  });
