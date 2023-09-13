import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/firebase";




export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

// export function useUser(auth) {
//   const [user, setUser] = useState();
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//       setUser(authUser);
//     });

//     return () => unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     onAuthStateChanged(auth, (authUser) => {
//       if (user === undefined) return;

//       // refresh when user changed to ease testing
//       if (user?.email !== authUser?.email) {
//         router.refresh();
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   return null;
// }
