import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQvD5XvrjWUeDfaqWia3nil3jl7PT4e-0",
  authDomain: "shams-shop.firebaseapp.com",
  databaseURL:
    "https://shams-shop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shams-shop",
  storageBucket: "shams-shop.appspot.com",
  messagingSenderId: "336581725002",
  appId: "1:336581725002:web:2e5d8843c214e1821e4fb3",
  measurementId: "G-S3MD8EL6QK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
