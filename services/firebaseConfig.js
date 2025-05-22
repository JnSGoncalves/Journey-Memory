import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6Vpkm8FN3uzWI-dVpIJ6HyptvuuDsZrQ",
  authDomain: "journey-memory-721.firebaseapp.com",
  projectId: "journey-memory-721",
  storageBucket: "journey-memory-721.firebasestorage.app",
  messagingSenderId: "922485413214",
  appId: "1:922485413214:web:5ada79f2ecc3e2d252abcf",
  measurementId: "G-F1WN3DC1KL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
