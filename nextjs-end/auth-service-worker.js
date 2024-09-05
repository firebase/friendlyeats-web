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

self.addEventListener("activate", () => {
  self.clients.claim();
});

// Notify clients of onAuthStateChanged events, so they can coordinate
// any actions which may normally be prone to race conditions, such as
// router.refresh();
auth.authStateReady().then(() => {
  onAuthStateChanged(auth, async (user) => {
    const uid = user?.uid;
    const clients = await self.clients.matchAll();
    for (const client of clients) {
      client.postMessage({ type: "onAuthStateChanged", uid });
    }
  });
});

async function getAuthIdToken() {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
};

self.addEventListener("fetch", (event) => {
  const { origin, pathname } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  if (pathname.startsWith('/_next/')) return;
  // Don't add haeders to GET requests with an extension—this skips css, images, fonts, json, etc.
  if (event.request.method === "GET" && !pathname.startsWith("/api/") && pathname.includes(".")) return;
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
