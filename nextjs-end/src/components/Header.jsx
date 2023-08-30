'use client'
import React from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
} from "@/src/lib/firebase/auth.js";
import {getUser} from '@/src/lib/getUser'
import { auth } from '@/src/lib/firebase/firebase'
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";

export default function Header() {
	const user = getUser()

	const handleSignOut = event => {
		event.preventDefault();
		signOut(auth);
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle(auth);
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
							<img src="/profile.svg" alt={user.email} />
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
				<a href="#" onClick={handleSignIn}>
					Sign In with Google
				</a>
			)}
		</header>
	);
}
