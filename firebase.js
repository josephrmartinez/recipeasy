// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Connect to firebase
export const db = getFirestore(app);

// Connect to storage
export const storage = getStorage(app);

// Get api key
// const docRef = doc(db, 'api-keys', 'openai-api-key')
// const docSnap = await getDoc(docRef)
// const key = docSnap.data()
// export const openaiKey = key