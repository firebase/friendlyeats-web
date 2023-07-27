import {
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

// Replace the following three empty functions definitions
export function onAuthStateChanged() {}

export async function signInWithGoogle() {}

export async function signOut() {}
