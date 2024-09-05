import { initializeApp } from "firebase/app";
import { getAuth, getIdToken, onIdTokenChanged } from "firebase/auth";

// extract firebase config from query string
const serializedFirebaseConfig = new URLSearchParams(self.location.search).get('firebaseConfig');
if (!serializedFirebaseConfig) {
  throw new Error('Firebase Config object not found in service worker query string.');
}

const firebaseConfig = JSON.parse(serializedFirebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

self.addEventListener("install", () => {
  console.log("Service worker installed with Firebase config", firebaseConfig);
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

// Allow the client to send a temporary override to the idToken, this allows for
// router.refresh() without worrying about the client and service worker having
// race conditions.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_ID_TOKEN") {
    getAuthIdToken = () => Promise.resolve(event.data.idToken);
  }
});

// Once the idTokenChanged event fires, change back to the original method
auth.authStateReady().then(() => {
  onIdTokenChanged(auth, () => {
    getAuthIdToken = DEFAULT_GET_AUTH_ID_TOKEN;
  });
});

const DEFAULT_GET_AUTH_ID_TOKEN = async () => {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
};

let getAuthIdToken = DEFAULT_GET_AUTH_ID_TOKEN;

self.addEventListener("fetch", (event) => {
  const { origin, pathname } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  if (pathname.includes(".")) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  const authIdToken = await getAuthIdToken();
  if (authIdToken) {
    const headers = new Headers(request.headers);
    headers.append("Authorization", `Bearer ${authIdToken}`);
    request = new Request(request, { headers });
  }
  return await fetch(request);
}
