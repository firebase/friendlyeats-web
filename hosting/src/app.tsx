import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { Routes, Route } from 'react-router-dom';
import {
    useFirebaseApp,
    FirestoreProvider,
    StorageProvider,
    AuthProvider,
    FunctionsProvider,
    AppCheckProvider,
} from 'reactfire';
import {
    initializeAppCheck,
    ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { APP_CHECK_TOKEN } from './firebase-config';
import Header from './components/header';
import Home from './pages/home';
import Restaurant from './pages/restaurant';

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
  }
}

function App() {
    const app = useFirebaseApp();
    const firestoreInstance = getFirestore(app);
    const storageInstance = getStorage(app);
    const authInstance = getAuth(app);
    const functionsInstance = getFunctions(app);
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(APP_CHECK_TOKEN),
        isTokenAutoRefreshEnabled: true,
    });

    if (process.env.NODE_ENV !== 'production') {
        // Set up emulators
        connectStorageEmulator(storageInstance, '127.0.0.1', 9199);
        connectAuthEmulator(authInstance, 'http://127.0.0.1:9099', {
            disableWarnings: true,
        });
        connectFirestoreEmulator(firestoreInstance, '127.0.0.1', 8080);
        connectFunctionsEmulator(functionsInstance, '127.0.0.1', 5001);
        
        // Enable local testing for App Check
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    return (
        <AppCheckProvider sdk={appCheck}>
            <FirestoreProvider sdk={firestoreInstance}>
                <StorageProvider sdk={storageInstance}>
                    <AuthProvider sdk={authInstance}>
                        <FunctionsProvider sdk={functionsInstance}>
                            <Routes>
                                <Route path="/" element={<Header />}>
                                    <Route index element={<Home />} />
                                    <Route path="/restaurant/:id" element={<Restaurant />} />
                                </Route>
                            </Routes>
                        </FunctionsProvider>
                    </AuthProvider>
                </StorageProvider>
            </FirestoreProvider>
        </AppCheckProvider>
    );
}

export default App;
