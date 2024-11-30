// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {Database, getDatabase} from "firebase/database"
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

const WebApp = {
  "name": "projects/look-vince/webApps/1:1001354898081:web:ad7b211141974cf82fdee0",
  "appId": "1:1001354898081:web:ad7b211141974cf82fdee0",
  "displayName": "simple-facebook",
  "projectId": "look-vince",
  "webId": "ODZhYWE1ZGEtYjA2Zi00MjNiLWI2MzQtZmVkY2JmZTFiODky",
  "apiKeyId": "0e6e6825-eb42-4b28-8424-10cd7e4b8027",
  "state": "ACTIVE",
  "expireTime": "1970-01-01T00:00:00Z",
  "etag": "1_0253c75a-2ca0-4f45-a99d-ffa1aa2e2c62"
}

const WebConfig = {
  "projectId": "look-vince",
  "appId": "1:1001354898081:web:ad7b211141974cf82fdee0",
  "databaseURL": "https://look-vince-default-rtdb.asia-southeast1.firebasedatabase.app",
  "storageBucket": "look-vince.appspot.com",
  "locationId": "asia-southeast1",
  "apiKey": "AIzaSyBIUKGA_wTZ57l2mjLpKVgD3WyQT6XCBXs",
  "authDomain": "look-vince.firebaseapp.com",
  "messagingSenderId": "1001354898081",
  "measurementId": "G-0Y8J2Q1G13"
}


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
