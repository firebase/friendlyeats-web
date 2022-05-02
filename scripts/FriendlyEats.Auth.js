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
    // return new Promise((resolve, reject) => {
    //   onAuthStateChanged(this.auth, user => {
    //     if(user != null) {
    //       resolve(user)
    //     } else {
    //       reject(new Error('No user logged in'));
    //     }
    //   })
    // });
  }
}
