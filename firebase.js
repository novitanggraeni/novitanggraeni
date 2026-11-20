
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8hfTr7eO8wL8WKbEWAPvLsrOcrE3rsYk",
  authDomain: "novira-store.firebaseapp.com",
  projectId: "novira-store",
  storageBucket: "novira-store.firebasestorage.app",
  messagingSenderId: "899904846142",
  appId: "1:899904846142:web:ad25fc9be381e69f7ed46f",
  measurementId: "G-6CN4CY61VS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  signInWithEmailAndPassword,
  signOut
};
