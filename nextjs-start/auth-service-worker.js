import { initializeApp } from "firebase/app";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";

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

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { origin, pathname } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  // Use a magic url to ensure that auth state is in sync between
  // the client and the sw, this helps with actions such as router.refresh();
  if (pathname.startsWith('/__/auth/wait/')) {
    const uid = pathname.split('/').at(-1);
    event.respondWith(waitForMatchingUid(uid));
    return;
  }
  if (pathname.startsWith('/_next/')) return;
  // Don't add headers to non-get requests or those with an extension—this
  // helps with css, images, fonts, json, etc.
  if (event.request.method === "GET" && pathname.includes(".")) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

// TODO: add Firebase Authentication headers to request
async function fetchWithFirebaseHeaders(request) {
  return await fetch(request);
}

async function waitForMatchingUid(_uid) {
  const uid = _uid === "undefined" ? undefined : _uid;
  // TODO: wait for the expected user to deal with race conditions
  return new Response(undefined, { status: 200, headers: { "cache-control": "no-store" } });
}

// TODO: get user token
async function getAuthIdToken() {
  throw new Error('not implemented');
}
