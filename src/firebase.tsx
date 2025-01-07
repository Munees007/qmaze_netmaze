// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_DB_APIKEY,
  authDomain: import.meta.env.VITE_APP_DB_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_APP_DB_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_DB_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_DB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_DB_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APP_DB_APPID
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore(app);
export const storage = getStorage(app);
