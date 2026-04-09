// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6r6UHnIaVXMsNNowIrADUSyHGPm-keRk",
  authDomain: "amishav-intel-haifa.firebaseapp.com",
  projectId: "amishav-intel-haifa",
  storageBucket: "amishav-intel-haifa.firebasestorage.app",
  messagingSenderId: "428884347000",
  appId: "1:428884347000:web:c2884d00b9cfa28103c58d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
