import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD6OQXHAugeFrHXU1ufpTshlTJMuZmd1t4",
  authDomain: "instagram-clone-react-8f248.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-8f248-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-8f248",
  storageBucket: "instagram-clone-react-8f248.appspot.com", // ✅ FIX THIS TOO
  messagingSenderId: "247213486121",
  appId: "1:247213486121:web:322318eb018758927bec38",
  measurementId: "G-5H0JXTM80T"
};

const firebaseApp = firebase.initializeApp(firebaseConfig); // ✅ ADD THIS

const db = firebaseApp.firestore();
const auth = firebase.auth();


export { db, auth };
