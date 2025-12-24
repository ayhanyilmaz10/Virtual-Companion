// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Note: Analytics is not supported in React Native, removed getAnalytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAghQE0SsLPHs-Cp5Muwo9XzJ1BdPOGtlE",
  authDomain: "fir-e5dd9.firebaseapp.com",
  projectId: "fir-e5dd9",
  storageBucket: "fir-e5dd9.firebasestorage.app",
  messagingSenderId: "871087435639",
  appId: "1:871087435639:web:407c673ac994d645c2bb72",
  measurementId: "G-3DB41RP4KZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
