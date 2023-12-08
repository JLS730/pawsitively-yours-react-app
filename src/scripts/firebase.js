// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const firebaseConfig = {

  apiKey: "AIzaSyAhBZYgbQ_pJt-ZIlF2fv7UZCyV_7aLtz4",

  authDomain: "pawsitively-yours-d9dc5.firebaseapp.com",

  projectId: "pawsitively-yours-d9dc5",

  storageBucket: "pawsitively-yours-d9dc5.appspot.com",

  messagingSenderId: "324151307643",

  appId: "1:324151307643:web:73f7c1b8cb57471fb221de",

  measurementId: "G-TRXWHYQJ0E"

};




// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const firestoreDB = getFirestore(app)
const analytics = getAnalytics(app);