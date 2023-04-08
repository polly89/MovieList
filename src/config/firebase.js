// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCm5YXm6fs0ZVBpmC37rARmT39m-jrcEMY",
  authDomain: "fir-react-test-1acf0.firebaseapp.com",
  projectId: "fir-react-test-1acf0",
  storageBucket: "fir-react-test-1acf0.appspot.com",
  messagingSenderId: "826861096701",
  appId: "1:826861096701:web:4d8671965178104268f894",
  measurementId: "G-285S6LRF8Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app)
export const storage = getStorage(app)