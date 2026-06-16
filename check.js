import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function check() {
  const snapshot = await getDocs(collection(db, 'projects'));
  const counts = {};
  snapshot.docs.forEach((doc) => {
    const category = doc.data().category;
    counts[category] = (counts[category] || 0) + 1;
  });
  console.log(counts);
}

check().catch(console.error);
