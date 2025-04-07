import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/clientApp";

export function onAuthStateChanged(cb) {
  return () => {};
}

export function onIdTokenChanged(cb) {
  return () => {};
}

export async function signInWithGoogle() {
  return;
}

export async function signOut() {
  return;
}
