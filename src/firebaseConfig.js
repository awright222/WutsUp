import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxl4_ycDhiYZeBapAutEy14KTMbSXn0E8",
  authDomain: "wutsup-58473.firebaseapp.com",
  projectId: "wutsup-58473",
  storageBucket: "wutsup-58473.appspot.app",
  messagingSenderId: "1094609342035",
  appId: "1:1094609342035:web:761b99748ec6f59df000a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
