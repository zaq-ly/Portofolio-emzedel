/**
 * Migrasi data dari Supabase ke Firebase.
 * Jalankan sekali sebelum menghapus kredensial Supabase dari .env.
 *
 * Prasyarat:
 * 1. npm install firebase @supabase/supabase-js (supabase hanya untuk script ini)
 * 2. Isi VITE_FIREBASE_* dan VITE_SUPABASE_* di .env
 * 3. Deploy firestore.rules & storage.rules di Firebase Console
 * 4. Buat akun admin di Firebase Authentication (Email/Password)
 * 5. Untuk script ini: sementara izinkan write di Firestore Rules, atau gunakan Firebase Admin SDK
 *
 * Usage: node migrate-supabase-to-firebase.js
 */
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

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

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: envVars['VITE_FIREBASE_API_KEY'],
  authDomain: envVars['VITE_FIREBASE_AUTH_DOMAIN'],
  projectId: envVars['VITE_FIREBASE_PROJECT_ID'],
  storageBucket: envVars['VITE_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId: envVars['VITE_FIREBASE_APP_ID'],
};

if (!firebaseConfig.projectId) {
  console.error('Missing Firebase config in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log('Fetching projects from Supabase...');
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  console.log(`Found ${projects.length} projects. Migrating to Firestore...`);

  const existingSnapshot = await getDocs(collection(db, 'projects'));
  const existingKeys = new Set(
    existingSnapshot.docs.map((d) => `${d.data().title}::${d.data().image_url}`),
  );

  for (const p of projects) {
    const key = `${p.title}::${p.image_url}`;
    if (existingKeys.has(key)) {
      console.log(`Skipping existing: ${p.title}`);
      continue;
    }

    await addDoc(collection(db, 'projects'), {
      title: p.title,
      category: p.category,
      description: p.description || '',
      image_url: p.image_url,
      tags: p.tags || [],
      created_at: p.created_at ? new Date(p.created_at) : serverTimestamp(),
    });

    console.log(`Migrated: ${p.title}`);
  }

  console.log('Migration complete!');
  console.log('Note: image_url masih menunjuk ke Supabase Storage. Upload ulang via admin jika perlu pindah gambar.');
}

migrate();
