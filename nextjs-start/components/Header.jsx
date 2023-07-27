"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged,
} from "@/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/lib/firebase/firestore.js";

async function handleUserSession() {}

function useUserSession() {}

export default function Header({ initialUser }) {
	const user = useUserSession(initialUser);

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
