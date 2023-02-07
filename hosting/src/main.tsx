import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import './index.css';
import { FirebaseAppProvider } from 'reactfire';
import { BrowserRouter } from 'react-router-dom';

const firebaseConfig = {
    // your firebase configs
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
