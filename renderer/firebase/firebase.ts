import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_ENV_FIREBASE_APP_KEY,
  authDomain: process.env.NEXT_PUBLIC_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_ENV_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_ENV_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const fireStore = getFirestore(app);
export const storage = getStorage(app);
