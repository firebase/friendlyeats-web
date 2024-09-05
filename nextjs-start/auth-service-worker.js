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

// TODO: add Firebase Authentication headers to request
async function fetchWithFirebaseHeaders(request) {
  return await fetch(request);
}

// TODO: get user token
async function getAuthIdToken(auth) {
  throw new Error('not implemented');
}
