import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoru0yIHlZUNRGsffNN1NSK8_kCCbn1S0",
  authDomain: "shopping-list-9777c.firebaseapp.com",
  projectId: "shopping-list-9777c",
  storageBucket: "shopping-list-9777c.firebasestorage.app",
  messagingSenderId: "887524888608",
  appId: "1:887524888608:web:d62762717db369ae82ec45"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export {};