import RestaurantListings from "@/src/components/RestaurantListings.jsx";
import { getRestaurants } from "@/src/lib/firebase/firestore.js";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

// This line also forces this route to be server-side rendered
// export const revalidate = 0;

export default async function Home({ searchParams }) {
	// Using seachParams which Next.js provides, allows the filtering to happen on the server-side, for example:
	// ?city=London&category=Indian&sort=Review
	const restaurants = await getRestaurants(searchParams);
	return (
		<main className="main__home">
			<RestaurantListings
				initialRestaurants={restaurants}
				searchParams={searchParams}
			/>
		</main>
	);
}
