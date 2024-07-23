// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC48kyxwmyoPBfYDR4lo5bgLvtql1k9ar4",
//   authDomain: "some-test-fa34b.firebaseapp.com",
//   projectId: "some-test-fa34b",
//   storageBucket: "some-test-fa34b.appspot.com",
//   messagingSenderId: "222357070366",
//   appId: "1:222357070366:web:a35d9ecf708ef6498f040f",
//   measurementId: "G-SMGM3RDWSL"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// // const analytics = getAnalytics(app);


// firebase-config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC48kyxwmyoPBfYDR4lo5bgLvtql1k9ar4",
  authDomain: "some-test-fa34b.firebaseapp.com",
  projectId: "some-test-fa34b",
  storageBucket: "some-test-fa34b.appspot.com",
  messagingSenderId: "222357070366",
  appId: "1:222357070366:web:a35d9ecf708ef6498f040f",
  measurementId: "G-SMGM3RDWSL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
