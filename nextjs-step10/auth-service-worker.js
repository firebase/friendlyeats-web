import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// this is set during install
let config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// When deployed, there are quotes that need to be stripped
Object.keys(config).forEach((key) => {
  const configValue = config[key] + "";
  if (configValue.charAt(0) === '"') {
    config[key] = configValue.substring(1, configValue.length - 1);
  }
});

const firebaseConfig = config

self.addEventListener('install', event => {
  // Skip over the "waiting" lifecycle state to make sure this is activated immediatly.
  self.skipWaiting();

  // extract firebase config from query string
  console.log("Service worker installed with Firebase config", firebaseConfig);
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

self.addEventListener('activate', function (event) {
  console.log('Claiming control');
  return self.clients.claim();
});

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);
  const [authIdToken, installationToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ]);
  headers.append("Firebase-Instance-ID-Token", installationToken);
  if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
  const newRequest = new Request(request, { headers });
  return await fetch(newRequest);
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}
