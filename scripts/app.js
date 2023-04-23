import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { config } from "./config";
import { FriendlyEats } from "./FriendlyEats";

window.onload = () => {
  const firebaseApp = initializeApp(config.firebase);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", "8080");
  new FriendlyEats(firebaseApp);
};
