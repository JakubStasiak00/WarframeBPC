// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCc6mClCxHLqG2_WJ8VOofqzCFebvgPy1M',
  authDomain: 'warframebpc.firebaseapp.com',
  projectId: 'warframebpc',
  storageBucket: 'warframebpc.appspot.com',
  messagingSenderId: '44606320587',
  appId: '1:44606320587:web:217b67b1a993c5ac1a904e',
  measurementId: 'G-XGZEJEENGC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, () => {
  if (auth.currentUser) {
    sessionStorage.setItem('isAuth', 'true');
    sessionStorage.setItem('isVerified', `${auth.currentUser.emailVerified}`);
  } else {
    sessionStorage.removeItem('isAuth');
    sessionStorage.removeItem('isVerified');
  }
});

export { db, auth };
