"use server";

import { addReviewToRestaurant } from "@/lib/firebase/firestore.js";

// This is a next.js server action, an alpha feature, so
// use with caution
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
export async function handleReviewFormSubmission(data) {
	await addReviewToRestaurant(data.get("restaurantId"), {
		text: data.get("text"),
		rating: data.get("rating"),

		// This came from a hidden form field
		userId: data.get("userId"),
	});
}
