import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import './index.css';
import { FirebaseAppProvider } from 'reactfire';
import { BrowserRouter } from 'react-router-dom';

const firebaseConfig = {
    apiKey: 'AIzaSyAxgwfnC2ZkeRUFflCeu163-SNnw_mv-tU',
    authDomain: 'dice-386911.firebaseapp.com',
    projectId: 'dice-386911',
    storageBucket: 'dice-386911.appspot.com',
    messagingSenderId: '383057988649',
    appId: '1:383057988649:web:5730073e2b2d5f2e426038',
    measurementId: 'G-ZXE0D4J717',
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </FirebaseAppProvider>
    </React.StrictMode>
);
