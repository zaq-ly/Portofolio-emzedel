import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseClient';
import { transformProject } from '../utils/projects';

const PROJECTS_COLLECTION = 'projects';

const docToProject = (snapshot) => {
  const data = snapshot.data();
  return transformProject({
    id: snapshot.id,
    ...data,
    created_at: data.created_at?.toDate?.()?.toISOString?.() ?? data.created_at,
  });
};

export const fetchProjects = async () => {
  if (!db) return [];
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToProject);
};

export const subscribeProjects = (onData, onError) => {
  if (!db) {
    // Firebase tidak tersedia, panggil onData dengan array kosong
    onData([]);
    return () => {}; // no-op unsubscribe
  }
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('created_at', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map(docToProject)),
    onError,
  );
};

export const createProject = async ({ title, category, description, tags, image_url }) => {
  if (!db) throw new Error('Firebase tidak terhubung. Periksa konfigurasi .env');
  await addDoc(collection(db, PROJECTS_COLLECTION), {
    title,
    category,
    description,
    tags,
    image_url,
    created_at: serverTimestamp(),
  });
};

export const updateProject = async (id, { title, category, description, tags }) => {
  if (!db) throw new Error('Firebase tidak terhubung. Periksa konfigurasi .env');
  const projectRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(projectRef, { title, category, description, tags });
};

export const deleteProject = async (id) => {
  if (!db) throw new Error('Firebase tidak terhubung. Periksa konfigurasi .env');
  await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
};

export const uploadProjectImage = async (file) => {
  if (!storage) throw new Error('Firebase Storage tidak terhubung. Periksa konfigurasi .env');
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const filePath = `gallery/${fileName}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
