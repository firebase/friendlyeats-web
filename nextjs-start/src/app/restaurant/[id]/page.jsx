import Restaurant from "@/src/components/Restaurant.jsx";
import { Suspense } from "react";
import { getRestaurantById } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser, getAuthenticatedAppForUser as getUser } from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function Home({ params }) {
  // This is a server component, we can access URL
	// parameters via Next.js and download the data
	// we need for this page
  const { currentUser } = await getUser();
  const {firebaseServerApp} = await getAuthenticatedAppForUser();
  const restaurant = await getRestaurantById(getFirestore(firebaseServerApp), params.id);

  return (
    <main className="main__restaurant">
      <Restaurant
        id={params.id}
        initialRestaurant={restaurant}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary restaurantId={params.id} />
        </Suspense>
      </Restaurant>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={restaurant.numRatings} />}
      >
        <ReviewsList restaurantId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}
