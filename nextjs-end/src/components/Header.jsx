'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged,
	onIdTokenChanged,
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "@/src/lib/firebase/config";
import { getIdToken } from "firebase/auth";

function useUserSession(initialUser) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const [serviceWorker, setServiceWorker] = useState(undefined);
	const router = useRouter();

	// Register the service worker that sends auth state back to server
	// The service worker is built with npm run build-service-worker
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`
		
		  navigator.serviceWorker
			.register(serviceWorkerUrl)
			.then(async (registration) => {
				setServiceWorker(registration.active);
				console.log("scope is: ", registration.scope)
			});
		}
	}, []);

	useEffect(() => {
		return onAuthStateChanged((authUser) => {
			setUser(authUser)
		});
	}, []);

	useEffect(() => {
		if (serviceWorker) {
			// listen to an onAuthStateChanged event from the service worker when
			// refreshing the router, this is preferred over onAuthStateChanged as
			// that can introduce race conditions as the client & service worker state
			// can be out of sync
			return navigator.serviceWorker.addEventListener("message", (event) => {
				if (event.source !== serviceWorker) return;
				if (event.data.type !== "onAuthStateChanged") return;
				event.preventDefault();
				if (user?.uid === event.data?.uid) return;
				router.refresh();
			});
		}
	}, [user, serviceWorker]);

	return user;
}

export default function Header({initialUser}) {

	const user = useUserSession(initialUser) ;

	const handleSignOut = event => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				<img src="/friendly-eats.svg" alt="FriendlyEats" />
				Friendly Eats
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img className="profileImage" src={user.photoURL || "/profile.svg"} alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a
										href="#"
										onClick={addFakeRestaurantsAndReviews}
									>
										Add sample restaurants
									</a>
								</li>

								<li>
									<a href="#" onClick={handleSignOut}>
										Sign Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<div className="profile"><a href="#" onClick={handleSignIn}>
					<img src="/profile.svg" alt="A placeholder user image" />
					Sign In with Google
				</a></div>
			)}
		</header>
	);
}
