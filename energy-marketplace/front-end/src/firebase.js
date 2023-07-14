import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase



const firebaseConfig = {
  apiKey: "AIzaSyD3KN_urM6vwxFZ7x9pgjiDQ8L8I5YuXCk",
  authDomain: "greenenergytrading-1d1ac.firebaseapp.com",
  databaseURL: "https://greenenergytrading-1d1ac-default-rtdb.firebaseio.com",
  projectId: "greenenergytrading-1d1ac",
  storageBucket: "greenenergytrading-1d1ac.appspot.com",
  messagingSenderId: "844962742414",
  appId: "1:844962742414:web:2dc7ed6017f71dfd4ac9df",
  measurementId: "G-NGEGG9P95R"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


