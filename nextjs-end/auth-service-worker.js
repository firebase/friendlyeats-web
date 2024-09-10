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

async function fetchWithFirebaseHeaders(request) {
  const authIdToken = await getAuthIdToken();
  if (authIdToken) {
    const headers = new Headers(request.headers);
    headers.append("Authorization", `Bearer ${authIdToken}`);
    request = new Request(request, { headers });
  }
  return await fetch(request).catch((reason) => {
    console.error(reason);
    return new Response("Fail.", { status: 500, headers: { "content-type": "text/html" } });
  });
}

async function waitForMatchingUid(_uid) {
  const uid = _uid === "undefined" ? undefined : _uid;
  await auth.authStateReady();
  await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user?.uid === uid) {
              unsubscribe();
              resolve();
          }
      });
  });
  return new Response(undefined, { status: 200, headers: { "cache-control": "no-store" } });
}

async function getAuthIdToken() {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
};
