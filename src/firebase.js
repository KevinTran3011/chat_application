import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDRdfYYlLDl2KIVgMGGPU8zcMvUQ4GHMw",
  authDomain: "chat-application-11418.firebaseapp.com",
  projectId: "chat-application-11418",
  storageBucket: "chat-application-11418.appspot.com",
  messagingSenderId: "873772423262",
  appId: "1:873772423262:web:e407132b21808ad9fa3ccf",
  measurementId: "G-W4X4T9Q27B",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
