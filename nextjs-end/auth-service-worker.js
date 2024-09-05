import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";

// extract firebase config from query string
const serializedFirebaseConfig = new URLSearchParams(self.location.search).get('firebaseConfig');
if (!serializedFirebaseConfig) {
  throw new Error('Firebase Config object not found in service worker query string.');
}

const firebaseConfig = JSON.parse(serializedFirebaseConfig);

self.addEventListener("install", () => {
  console.log("Service worker installed with Firebase config", firebaseConfig);
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const authIdToken = await getAuthIdToken(auth);
  if (authIdToken) {
    const headers = new Headers(request.headers);
    headers.append("Authorization", `Bearer ${authIdToken}`);
    request = new Request(request, { headers });
  }
  return await fetch(request);
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}
