import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeRestaurantsAndReviews() {
  const restaurantsToAdd = 5;
  const data = [];

  for (let i = 0; i < restaurantsToAdd; i++) {
    const restaurantTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this restaurant
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(restaurantTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomData.restaurantReviews[
            randomNumberBetween(0, randomData.restaurantReviews.length - 1)
          ].rating,
        text: randomData.restaurantReviews[
          randomNumberBetween(0, randomData.restaurantReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    const restaurantData = {
      category:
        randomData.restaurantCategories[
          randomNumberBetween(0, randomData.restaurantCategories.length - 1)
        ],
      name: randomData.restaurantNames[
        randomNumberBetween(0, randomData.restaurantNames.length - 1)
      ],
      avgRating,
      city: randomData.restaurantCities[
        randomNumberBetween(0, randomData.restaurantCities.length - 1)
      ],
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      price: randomNumberBetween(1, 4),
      photo: `https://storage.googleapis.com/firestorequickstarts.appspot.com/food_${randomNumberBetween(
        1,
        22
      )}.png`,
      timestamp: restaurantTimestamp,
    };

    data.push({
      restaurantData,
      ratingsData,
    });
  }
  return data;
}
