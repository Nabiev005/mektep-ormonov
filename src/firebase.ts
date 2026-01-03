import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYOkhC3oPniYwlnlnevbExsIxFwa1a2UI",
  authDomain: "mektep-admin.firebaseapp.com",
  projectId: "mektep-admin",
  storageBucket: "mektep-admin.firebasestorage.app",
  messagingSenderId: "849433394944",
  appId: "1:849433394944:web:b4f257c27f787587bb3de5",
};

const app = initializeApp(firebaseConfig);

// Бул эки экспорт бизге азыр жетиштүү:
export const db = getFirestore(app);
export const auth = getAuth(app);