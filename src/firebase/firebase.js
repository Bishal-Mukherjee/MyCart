import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA4GO-lJyCkd4ehdsHT_dy7kA5aQOlf4gg',
  authDomain: 'myapp-fe4c1.firebaseapp.com',
  projectId: 'myapp-fe4c1',
  storageBucket: 'myapp-fe4c1.appspot.com',
  messagingSenderId: '695620149706',
  appId: '1:695620149706:web:d719bb0b8151c70874af33',
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storeactions = { doc, setDoc, getDoc, collection };
const auth = {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
};

export { firestore, storeactions, auth };
