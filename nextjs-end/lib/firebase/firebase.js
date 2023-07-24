import firebaseConfig from "@/lib/firebase/config.js";
import { initializeApp } from "firebase/app";

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getAuth, connectAuthEmulator } from "firebase/auth";

import { getStorage, connectStorageEmulator } from "firebase/storage";

import { getApps } from "firebase/app";

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// For development purposes only
connectFirestoreEmulator(db, "127.0.0.1", 8080);
connectStorageEmulator(storage, "127.0.0.1", 9199);
connectAuthEmulator(auth, "http://127.0.0.1:9099", {
	disableWarnings: true,
});
