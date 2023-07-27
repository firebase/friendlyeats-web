"use client";

// This components shows one individual restaurant
// It receives data from src/app/restaurant/[id]/page.jsx

import { React, useState, useEffect } from "react";
import {
	getRestaurantSnapshotById,
	getReviewsSnapshotByRestaurantId,
} from "@/lib/firebase/firestore.js";
import { updateRestaurantImage } from "@/lib/firebase/storage.js";
import { onAuthStateChanged } from "@/lib/firebase/auth.js";
import ReviewDialog from "@/components/ReviewDialog.jsx";
import RestaurantDetails from "@/components/RestaurantDetails.jsx";
import ReviewsList from "@/components/ReviewsList.jsx";

export default function Restaurant({
	id,
	initialRestaurant,
	initialReviews,
	initialUser,
}) {
	const [restaurant, setRestaurant] = useState(initialRestaurant);
	const [isOpen, setIsOpen] = useState(false);

	// The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
	const [userId, setUserId] = useState(initialUser?.id ?? "");
	const [review, setReview] = useState({
		rating: 0,
		text: "",
	});
	const [reviews, setReviews] = useState(initialReviews);

	const onChange = (value, name) => {
		setReview({ ...review, [name]: value });
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(user => {
			if (user) {
				setUserId(user.uid);
			} else {
				setUserId("");
			}
		});
		return () => {
			unsubscribe();
		};
	}, []);

	async function handleRestaurantImage(target) {
		const image = target.files ? target.files[0] : null;
		if (!image) {
			return;
		}

		const imageURL = await updateRestaurantImage(id, image);
		setRestaurant({ ...restaurant, photo: imageURL });
	}

	const handleClose = () => {
		setIsOpen(false);
		setReview({ rating: 0, text: "" });
	};

	useEffect(() => {
		const unsubscribeFromRestaurant = getRestaurantSnapshotById(
			id,
			data => {
				setRestaurant(data);
			}
		);

		const unsubscribeFromReviewsSnapshot = getReviewsSnapshotByRestaurantId(
			id,
			data => {
				setReviews(data);
			}
		);

		return () => {
			unsubscribeFromRestaurant();
			unsubscribeFromReviewsSnapshot();
		};
	}, []);

	return (
		<div>
			<RestaurantDetails
				restaurant={restaurant}
				userId={userId}
				handleRestaurantImage={handleRestaurantImage}
				setIsOpen={setIsOpen}
				isOpen={isOpen}
			/>
			<ReviewDialog
				isOpen={isOpen}
				handleClose={handleClose}
				review={review}
				onChange={onChange}
				userId={userId}
				id={id}
			/>
			<ReviewsList reviews={reviews} userId={userId} />
		</div>
	);
}
