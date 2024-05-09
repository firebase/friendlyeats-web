import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// this is set during install
let firebaseConfig;

self.addEventListener('install', event => {
  // extract firebase config from query string
  const serializedFirebaseConfig = new URL(location).searchParams.get('firebaseConfig');
  
  if (!serializedFirebaseConfig) {
    throw new Error('Firebase Config object not found in service worker query string.');
  }
  
  firebaseConfig = JSON.parse(serializedFirebaseConfig);
  console.log("Service worker installed with Firebase config", firebaseConfig);
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
