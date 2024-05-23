import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB8_IrhiJC-sY-QByDBjs8jx-IspwUf_zw",
  authDomain: "create-notes-fc4b0.firebaseapp.com",
  projectId: "create-notes-fc4b0",
  storageBucket: "create-notes-fc4b0.appspot.com",
  messagingSenderId: "349044750538",
  appId: "1:349044750538:web:4a11cee33653c96a5d1c33",
  measurementId: "G-3C0VT0GLLW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
// const analytics = getAnalytics(app);
export const provider = new GoogleAuthProvider()
export const dataBase = getFirestore(app)