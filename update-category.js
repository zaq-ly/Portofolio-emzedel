import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

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

async function updateCategory() {
  console.log("Updating category 'print' to 'poster' in Firestore...");

  const snapshot = await getDocs(
    query(collection(db, 'projects'), where('category', '==', 'print')),
  );

  let count = 0;
  for (const projectDoc of snapshot.docs) {
    await updateDoc(doc(db, 'projects', projectDoc.id), { category: 'poster' });
    count += 1;
  }

  console.log(`Successfully updated ${count} records.`);
}

updateCategory().catch(console.error);
