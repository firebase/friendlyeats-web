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
} from 'reactfire';
import Header from './components/header';
import Home from './pages/home';
import Restaurant from './pages/restaurant';

function App() {

    return (
        <Routes>
            <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
            </Route>
        </Routes>
    );
}

export default App;
