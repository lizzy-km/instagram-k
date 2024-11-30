// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";



const firebaseConfig = {
  apiKey: "AIzaSyBIUKGA_wTZ57l2mjLpKVgD3WyQT6XCBXs",
  authDomain: "look-vince.firebaseapp.com",
  databaseURL: "https://look-vince-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "look-vince",
  storageBucket: "look-vince.appspot.com",
  messagingSenderId: "1001354898081",
  appId: "1:1001354898081:web:ad7b211141974cf82fdee0",
  measurementId: "G-0Y8J2Q1G13"
};

// Initialize Firebase
firebase?.initializeApp(firebaseConfig)
// Initialize Firebase Authentication and get a reference to the service
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, auth, firestore, storage, analytics,db };
