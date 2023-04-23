import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export class Auth {
  constructor(firebaseApp) {
    this.firebaseApp = firebaseApp;
    this.auth = getAuth(firebaseApp);
  }

  signInAnonymously() {
    return signInAnonymously(this.auth);
  }

  getUser() {
    return this.auth.currentUser;
  }
}
