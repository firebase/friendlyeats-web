/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class Mock {
  constructor({ friendlyEats, data, auth }) {
    this.friendlyEats = friendlyEats;
    this.data = data;
    this.auth = auth;
  }

  /**
   * Adds a set of mock Restaurants to the Cloud Firestore.
   */
  addMockRestaurants() {
    let promises = [];

    for (let i = 0; i < 20; i++) {
      let name =
        this.friendlyEats.getRandomItem(this.friendlyEats.mockData.words) +
        " " +
        this.friendlyEats.getRandomItem(this.friendlyEats.mockData.words);
      let category = this.friendlyEats.getRandomItem(
        this.friendlyEats.mockData.categories
      );
      let city = this.friendlyEats.getRandomItem(
        this.friendlyEats.mockData.cities
      );
      let price = Math.floor(Math.random() * 4) + 1;
      let photoID = Math.floor(Math.random() * 22) + 1;
      let photo =
        "https://storage.googleapis.com/firestorequickstarts.appspot.com/food_" +
        photoID +
        ".png";
      let numRatings = 0;
      let avgRating = 0;

      let promise = this.data.addRestaurant({
        name: name,
        category: category,
        price: price,
        city: city,
        numRatings: numRatings,
        avgRating: avgRating,
        photo: photo
      });

      if (!promise) {
        alert("addRestaurant() is not implemented yet!");
        return Promise.reject();
      } else {
        promises.push(promise);
      }
    }

    return Promise.all(promises);
  }

  /**
   * Adds a set of mock Ratings to the given Restaurant.
   */
  addMockRatings(restaurantID) {
    let ratingPromises = [];
    for (let r = 0; r < 5 * Math.random(); r++) {
      let rating = this.friendlyEats.mockData.ratings[
        parseInt(this.friendlyEats.mockData.ratings.length * Math.random())
      ];
      let user = this.auth.getUser();
      rating.userName = "Bot (Web)";
      // For production data, use Firestore's serverTimestamp() function!
      rating.timestamp = new Date();
      rating.userId = user.uid;
      ratingPromises.push(this.data.addRating(restaurantID, rating));
    }
    return Promise.all(ratingPromises);
  }
}
