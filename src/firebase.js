import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCdB1CT9HH-cIVxBcmO4BzLv7uNYxwiAPQ",
  authDomain: "experticia-926b8.firebaseapp.com",
  projectId: "experticia-926b8",
  storageBucket: "experticia-926b8.firebasestorage.app",
  messagingSenderId: "107483260884",
  appId: "1:107483260884:web:8682902ec2242217999841"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signup = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user
        await addDoc(collection(db, "user"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email
        })
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split("-").join(" "))
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split("-").join(" "))
    }
}

const logout = () => {
    signOut(auth)
}

export {auth, db, login, signup, logout}