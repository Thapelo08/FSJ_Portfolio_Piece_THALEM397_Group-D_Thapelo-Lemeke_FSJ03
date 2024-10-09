// firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAR24wJ-vwl-WEM_y2xyTL3aBVznjtVDQQ",
  authDomain: "next-ecommerce-8d6f3.firebaseapp.com",
  projectId: "next-ecommerce-8d6f3",
  storageBucket: "next-ecommerce-8d6f3.appspot.com",
  messagingSenderId: "49467937521",
  appId: "1:49467937521:web:81a69a3373e999095ccf50"
};

// Initialize Firebase
const app =  initializeApp(firebaseConfig);
const auth = getAuth(app);


export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign-in function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign-out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};