// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.API_KEY_FIREBASE,
  authDomain: "anynote-m.firebaseapp.com",
  databaseURL:
    "https://anynote-m-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anynote-m",
  storageBucket: "anynote-m.appspot.com",
  messagingSenderId: "225963404826",
  appId: "1:225963404826:web:a6d81c3506a77d07f46ba3",
  measurementId: "G-DTLPTVRJFG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage();
const analytics = getAnalytics(app);

export { app, auth, firestore, storage, analytics };
