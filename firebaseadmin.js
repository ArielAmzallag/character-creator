import admin from 'firebase-admin';
import serviceAccount from './character-creator-26852-firebase-adminsdk-4z4jb-06ea184679.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://character-creator-26852-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();


const characters = [
  {
    name: "Frodo Baggins",
    universe: "The Lord of the Rings",
    description: "A hobbit of the Shire who inherits the One Ring from his cousin Bilbo Baggins and undertakes the quest to destroy it in the fires of Mount Doom.",
    equipment: ["The One Ring", "Sting", "Elven Cloak", "Mithril Shirt"],
    gender: "Male",
    appearance: { height: "Around 4'6\"", weight: "Unknown", hairColor: "Brown", eyeColor: "Blue", skinTone: "Fair", build: "Slim", distinguishingFeatures: "The One Ring" },
    attributes: { constitution: 13, strength: 7, dexterity: 14, magic: 0, luck: 15, wisdom: 10, intelligence: 12, charisma: 11 },
    skills: ["Stealth", "Resilience", "Courage"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/character-creator-26852.appspot.com/o/characterImages%2Ffrodo.jpg?alt=media&token=9ec488ff-4a26-4914-bbf1-3b562ed822be",
    isPublic: true,
    likeCount: 0
  },
  {
    name: "Harry Potter",
    universe: "Harry Potter",
    description: "A young wizard who discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.",
    equipment: ["Wand", "Invisibility Cloak", "Marauder's Map"],
    gender: "Male",
    appearance: { height: "Around 5'5\"", weight: "Unknown", hairColor: "Black", eyeColor: "Green", skinTone: "Light", build: "Slim", distinguishingFeatures: "Lightning bolt-shaped scar on forehead" },
    attributes: { constitution: 12, strength: 9, dexterity: 10, magic: 18, luck: 16, wisdom: 12, intelligence: 12, charisma: 14 },
    skills: ["Defensive spells", "Quidditch", "Parseltongue"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/character-creator-26852.appspot.com/o/characterImages%2Fharry.jpg?alt=media&token=8898e3d8-9921-41a3-b91b-690181c8be6b",
    isPublic: true,
    likeCount: 0
  },
  {
    name: "Daenerys Targaryen",
    universe: "Game of Thrones",
    description: "The last confirmed member of the Targaryen dynasty who was exiled to Essos during Robert's Rebellion and seeks to return to Westeros to reclaim her family's throne.",
    equipment: ["Dragons", "Unsullied army", "Dothraki horde"],
    gender: "Female",
    appearance: { height: "Around 5'2\"", weight: "Unknown", hairColor: "Silver-blond", eyeColor: "Violet", skinTone: "Fair", build: "Slim", distinguishingFeatures: "Three dragons" },
    attributes: { constitution: 10, strength: 8, dexterity: 11, magic: 0, luck: 12, wisdom: 13, intelligence: 14, charisma: 18 },
    skills: ["Leadership", "Dragon riding", "Linguistics"],
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/character-creator-26852.appspot.com/o/characterImages%2Fdaenerys.jpg?alt=media&token=1b88f562-57eb-4460-afed-977c33ff8f48",
    isPublic: true,
    likeCount: 0
  }
];

characters.forEach(async character => {
  await db.collection('characters').add(character);
  console.log(`Added character: ${character.name}`);
});