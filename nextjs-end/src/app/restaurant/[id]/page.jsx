import Restaurant from "@/components/Restaurant.jsx";
import {
	getRestaurantById,
	getReviewsByRestaurantId,
} from "@/lib/firebase/firestore.js";
import getUser from "@/lib/getUser.js";

export const dynamic = "force-dynamic";

export default async function Home({ params }) {
	// This is a server component, we can access URL
	// parameters via Next.js and download the data
	// we need for this page
	const restaurant = await getRestaurantById(params.id);
	const reviews = await getReviewsByRestaurantId(params.id);

	return (
		<main className="main__restaurant">
			<Restaurant
				id={params.id}
				initialRestaurant={restaurant}
				initialReviews={reviews}
				initialUser={getUser()}
			/>
		</main>
	);
}
