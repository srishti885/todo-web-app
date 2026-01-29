import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyCUcPQXnLD9-6TATtPB0b9dOdxWPs2IZH0",
  authDomain: "todo-app-assignment-60c26.firebaseapp.com",
  projectId: "todo-app-assignment-60c26",
  storageBucket: "todo-app-assignment-60c26.firebasestorage.app",
  messagingSenderId: "652827882858",
  appId: "1:652827882858:web:1a91001e1e0f6f63d36113"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORTS
export const auth = getAuth(app);
export const db = getFirestore(app); 