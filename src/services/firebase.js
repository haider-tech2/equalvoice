// Replace with your own Firebase config
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA2ydEOJkojhxvPi8RTPPp-rLiYFx5BtTQ",
  authDomain: "gender-equality-platform-ca4cd.firebaseapp.com",
  projectId: "gender-equality-platform-ca4cd",
  storageBucket: "gender-equality-platform-ca4cd.firebasestorage.app",
  messagingSenderId: "663542717484",
  appId: "1:663542717484:web:1badc7db6cc34a69bbc589",
  measurementId: "G-NXQ9BJ9T2Z"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export const logout = async () => {
  await signOut(auth)
}
