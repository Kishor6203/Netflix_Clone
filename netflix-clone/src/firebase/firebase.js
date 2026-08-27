import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2WLLT1Q6S6Eaz3QiQ6Xnjc6HlNmc-Ekg",
  authDomain: "netflix-clone-de282.firebaseapp.com",
  projectId: "netflix-clone-de282",
  storageBucket: "netflix-clone-de282.firebasestorage.app",
  messagingSenderId: "377788065860",
  appId: "1:377788065860:web:67813b0d5901fc0c86b411",
  measurementId: "G-M0KWG97ZHR"
};


const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);