// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const cfg = {
  apiKey: "AIzaSyDdMtlV1Eu2lhSU4S9UJqKPnhN0QuYypvY",
  authDomain: "sit313-9x1c.firebaseapp.com",
  projectId: "sit313-9x1c",
  storageBucket: "sit313-9x1c.firebasestorage.app",
  messagingSenderId: "954680352463",
  appId: "1:954680352463:web:139eebc39ce29eaa79a1ba"
};

export const app = initializeApp(cfg);
export const auth = getAuth(app);
