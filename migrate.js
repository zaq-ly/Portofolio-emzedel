import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { projects } from './src/data/projects.js';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    envVars[match[1].trim()] = val;
  }
});

const app = initializeApp({
  apiKey: envVars['VITE_FIREBASE_API_KEY'],
  authDomain: envVars['VITE_FIREBASE_AUTH_DOMAIN'],
  projectId: envVars['VITE_FIREBASE_PROJECT_ID'],
  storageBucket: envVars['VITE_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId: envVars['VITE_FIREBASE_APP_ID'],
});

const db = getFirestore(app);

async function migrate() {
  console.log(`Starting migration of ${projects.length} projects to Firestore...`);

  const existingSnapshot = await getDocs(collection(db, 'projects'));
  const existingKeys = new Set(
    existingSnapshot.docs.map((d) => `${d.data().title}::${d.data().image_url}`),
  );

  for (const p of projects) {
    const key = `${p.title}::${p.image}`;
    if (existingKeys.has(key)) {
      console.log(`Skipping existing: ${p.title}`);
      continue;
    }

    await addDoc(collection(db, 'projects'), {
      title: p.title,
      category: p.category,
      description: p.description || '',
      image_url: p.image,
      tags: p.tags,
      created_at: serverTimestamp(),
    });

    console.log(`Inserted: ${p.title}`);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
