import { createContext, useContext, useState, useEffect } from "react"
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "firebase/auth"
import { db } from "../services/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const auth = getAuth()


  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const loggedUser = result.user

    const userRef = doc(db, "users", loggedUser.uid)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        displayName: loggedUser.displayName,
        email: loggedUser.email,
        photoURL: loggedUser.photoURL,
        isAdmin: false, 
        createdAt: new Date()
      })
    }

    setUser({
      uid: loggedUser.uid,
      displayName: loggedUser.displayName,
      email: loggedUser.email,
      photoURL: loggedUser.photoURL
    })
  }

  const logout = () => auth.signOut()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        })
        const userRef = doc(db, "users", currentUser.uid)
        const docSnap = await getDoc(userRef)
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            isAdmin: false,
            createdAt: new Date()
          })
        }
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
