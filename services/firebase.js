import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCPWuB-horCV8cahgYIf0pOEVHbMRuE-ng",
  authDomain: "chat-app-a06d8.firebaseapp.com",
  databaseURL: "https://chat-app-a06d8.firebaseio.com/",
  projectId: "chat-app-a0d68",
  storageBucket: "chat-app-a06d8.firebasestorage.app",
  messagingSenderId: "699044907687",
  appId: "1:699044907687:web:cee16d64877103e695a982",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getDatabase(app);
export const auth = getAuth(app);

console.log("Database initialized:", db);
console.log("Firebase Config:", firebaseConfig);