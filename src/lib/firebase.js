import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
export const config = {
    apiKey: "AIzaSyDc3tDcHi7BPUuzIRDnSMTaDpeh6T6M_-0",
    authDomain: "friendlyeats-7ebaa.firebaseapp.com",
    projectId: "friendlyeats-7ebaa",
    storageBucket: "friendlyeats-7ebaa.appspot.com",
    messagingSenderId: "778791712564",
    appId: "1:778791712564:web:ecea5c5826c3e17ae0d761"
};

// Initialize Firebase
export const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth(app);
