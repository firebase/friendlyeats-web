import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createContext } from 'react';
import { useAuth, useUser } from 'reactfire';
class FirebaseService {
    auth = useAuth();
    user$ = useUser();

    signOut() {
        this.auth.signOut().then(() => console.log('signed out'));
    }

    async signIn() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(this.auth, provider);
    }

    getUser() {
        return this.user$.data;
    }
}

const firebaseService = new FirebaseService();
const FirebaseContext = createContext(firebaseService);
const { Provider } = FirebaseContext;
export const FirebaseProvider = ({ children }: any) => {
    return <Provider value={firebaseService}>{children}</Provider>;
};

export default FirebaseContext;
