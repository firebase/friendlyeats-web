/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

FireEats.prototype.addRestaurant = function(data) {
  /*
    TODO: Implement adding a document
  */
};

FireEats.prototype.addReview = function(restaurantID, review) {
  /*
    TODO: Retrieve add a review to a resterant
  */
};

FireEats.prototype.getRestaurant = function(id) {
  return firebase.firestore().collection("restaurants").doc(id).get();
};

FireEats.prototype.getAllRestaurants = function(render) {
  /*
    TODO: Retrieve list of restaurants
  */
};

FireEats.prototype.getFilteredRestaurants = function(filters, render) {
  /*
    TODO: Retrieve filtered list of restaurants
  */
};

FireEats.prototype.getDocumentsInQuery = function(query, render) {
  /*
    TODO: Render all documents in the provided query
  */
};

FireEats.prototype.addMockRestaurants = function() {
  for (let i = 0; i < 20; i++) {
    let name =
      this.getRandomItem(this.data.words) +
      " " +
      this.getRandomItem(this.data.words);
    let category = this.getRandomItem(this.data.categories);
    let city = this.getRandomItem(this.data.cities);
    let price = Math.floor(Math.random() * 4) + 1;
    let photoID = Math.floor(Math.random() * 22) + 1;
    let photo = `https://storage.googleapis.com/firestorequickstarts.appspot.com/food_${photoID}.png`;
    let ratingCount = 0;
    let averageRating = 0;

    const promise = this.addRestaurant({
      name,
      category,
      price,
      city,
      ratingCount,
      averageRating,
      photo
    });

    if (!promise) {
      alert("addRestaurant() is not implemented yet!");
      break;
    } else {
      promise.catch(err => {
        console.warn(err);
      });
    }
  }
};
