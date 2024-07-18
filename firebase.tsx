// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDAgCzIWgOBt8btYb3DFuTziKSyfUaxfA",
  authDomain: "word-wizard-2ca8d.firebaseapp.com",
  projectId: "word-wizard-2ca8d",
  storageBucket: "word-wizard-2ca8d.appspot.com",
  messagingSenderId: "879123063451",
  appId: "1:879123063451:web:c14d1fffd8bef9593fdc3e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export {app,db};