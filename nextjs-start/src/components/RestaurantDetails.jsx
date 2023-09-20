// This component shows restaurant metadata, and offers some actions to the user like uploading a new restaurant image, and adding a review.

import React from "react";
import renderStars from "@/src/components/Stars.jsx";

const RestaurantDetails = ({
	restaurant,
	userId,
	handleRestaurantImage,
	setIsOpen,
	isOpen,
}) => {
	return (
		<section className="img__section">
			<img src={restaurant.photo} alt={restaurant.name} />

			<div className="actions">
				{userId && (
					<img
						className="review"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
						src="/review.svg"
					/>
				)}
				<label
					onChange={event => handleRestaurantImage(event.target)}
					htmlFor="upload-image"
					className="add"
				>
					<input
						name=""
						type="file"
						id="upload-image"
						className="file-input hidden w-full h-full"
					/>

					<img className="add-image" src="/add.svg" alt="Add image" />
				</label>
			</div>

			<div className="details__container">
				<div className="details">
					<h2>{restaurant.name}</h2>

					<div className="restaurant__rating">
						<ul>{renderStars(restaurant.avgRating)}</ul>

						<span>({restaurant.numRatings})</span>
					</div>

					<p>
						{restaurant.category} | {restaurant.city}
					</p>
					<p>{"$".repeat(restaurant.price)}</p>
				</div>
			</div>
		</section>
	);
};

export default RestaurantDetails;
