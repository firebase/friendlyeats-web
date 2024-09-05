// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import { headers } from "next/headers";
import { initializeServerApp } from "firebase/app";

import { firebaseConfig } from "./config";
import { getAuth } from "firebase/auth";

export async function getAuthenticatedAppForUser() {
  const authIdToken = headers().get("Authorization")?.split("Bearer ")[1];

  const firebaseServerApp = initializeServerApp(firebaseConfig, {
    authIdToken
  });

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}