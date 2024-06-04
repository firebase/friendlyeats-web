"use client";

// This components handles the restaurant listings page
// It receives data from src/app/page.jsx, such as the initial restaurants and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getRestaurantsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const RestaurantItem = ({ restaurant }) => (
	<li key={restaurant.id}>
		<Link href={`/restaurant/${restaurant.id}`}>
			<ActiveResturant restaurant={restaurant} />
		</Link>
	</li>
);

const ActiveResturant = ({ restaurant }) => (
	<div>
		<ImageCover photo={restaurant.photo} name={restaurant.name} />
		<ResturantDetails restaurant={restaurant} />
	</div>
);

const ImageCover = ({ photo, name }) => (
	<div className="image-cover">
		<img src={photo} alt={name} />
	</div>
);

const ResturantDetails = ({ restaurant }) => (
	<div className="restaurant__details">
		<h2>{restaurant.name}</h2>
		<RestaurantRating restaurant={restaurant} />
		<RestaurantMetadata restaurant={restaurant} />
	</div>
);

const RestaurantRating = ({ restaurant }) => (
	<div className="restaurant__rating">
		<ul>{renderStars(restaurant.avgRating)}</ul>
		<span>({restaurant.numRatings})</span>
	</div>
);

const RestaurantMetadata = ({ restaurant }) => (
	<div className="restaurant__meta">
		<p>
			{restaurant.category} | {restaurant.city}
		</p>
		<p>{"$".repeat(restaurant.price)}</p>
	</div>
);

export default function RestaurantListings({
	initialRestaurants,
	searchParams,
}) {
	const router = useRouter();

	// The initial filters are the search params from the URL, useful for when the user refreshes the page
	const initialFilters = {
		city: searchParams.city || "",
		category: searchParams.category || "",
		price: searchParams.price || "",
		sort: searchParams.sort || "",
	};

	const [restaurants, setRestaurants] = useState(initialRestaurants);
	const [filters, setFilters] = useState(initialFilters);

	useEffect(() => {
		routerWithFilters(router, filters);
	}, [filters]);

	useEffect(() => {
		const unsubscribe = getRestaurantsSnapshot(data => {
			setRestaurants(data);
		}, filters);

		return () => {
			unsubscribe();
		};
	}, [filters]);

	return (
		<article>
			<Filters filters={filters} setFilters={setFilters} />
			<ul className="restaurants">
				{restaurants.map(restaurant => (
					<RestaurantItem
						key={restaurant.id}
						restaurant={restaurant}
					/>
				))}
			</ul>
		</article>
	);
}

function routerWithFilters(router, filters) {
	const queryParams = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== "") {
			queryParams.append(key, value);
		}
	}

	const queryString = queryParams.toString();
	router.push(`?${queryString}`);
}
