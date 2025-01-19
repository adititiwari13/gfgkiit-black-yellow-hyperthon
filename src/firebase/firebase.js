// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL5_WmuVSmKmjc2L_iO1IZzV7eQNEeFgw",
  authDomain: "task-master-2dde7.firebaseapp.com",
  projectId: "task-master-2dde7",
  storageBucket: "task-master-2dde7.firebasestorage.app",
  messagingSenderId: "811345095531",
  appId: "1:811345095531:web:e891f2065ea27471b13a2e",
  measurementId: "G-GEKXTGSXXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);