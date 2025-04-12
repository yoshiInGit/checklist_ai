// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Authentication モジュールをインポート
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:           "AIzaSyB1OpmNmLCv-stivWGYMbaE_C09AKoAUa8",
  authDomain:       "autolist-3828a.firebaseapp.com",
  projectId:        "autolist-3828a",
  storageBucket:    "autolist-3828a.firebasestorage.app",
  messagingSenderId: "527135891248",
  appId:             "1:527135891248:web:38e131b45130a8b6aab2f5",
  measurementId:     "G-B8B3YJ2BVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // auth インスタンスをエクスポート
// Initialize Firebase


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);