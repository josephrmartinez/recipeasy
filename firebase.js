// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from "firebase/functions";



const firebaseConfig = {
  apiKey: "AIzaSyDKVquosvLk91ck2yZF80p5hvwz1qTxD30",
  authDomain: "skiptorecipe-e2ede.firebaseapp.com",
  projectId: "skiptorecipe-e2ede",
  storageBucket: "skiptorecipe-e2ede.appspot.com",
  messagingSenderId: "899375445535",
  appId: "1:899375445535:web:84466a257d38b7dd57472a",
  measurementId: "G-1GDCCWYHXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize functions
const functions = getFunctions(app)

// Connect to firebase
export const db = getFirestore(app);

// Connect to storage
export const storage = getStorage(app);

