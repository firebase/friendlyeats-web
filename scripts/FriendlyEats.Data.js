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

import {
  onSnapshot,
  collection,
  getFirestore,
  query,
  limit,
  addDoc,
  orderBy,
  doc,
  getDoc,
  getDocs,
  where,
  runTransaction
} from "firebase/firestore";

export class Data {
  constructor({ firebaseApp }) {
    this.db = getFirestore(firebaseApp);
  }

  addRestaurant(data) {
    const restaurantsCol = collection(this.db, 'restaurants');
    return addDoc(restaurantsCol, data);
  }

  getAllRestaurants(renderer) {
    const restaurantsCol = collection(this.db, 'restaurants');
    const restaurantsQuery = query(restaurantsCol, orderBy("avgRating", "desc"), limit(50));
    this.getDocumentsInQuery(restaurantsQuery, renderer);
  }

  getDocumentsInQuery(restaurantsQuery, renderer) {
    onSnapshot(restaurantsQuery, (snapshot) => {
      if (!snapshot.size) return renderer.empty();

      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          renderer.remove(change.doc);
        } else {
          renderer.display(change.doc);
        }
      });
    });
  }

  async getRestaurant(id) {
    const docRef = doc(this.db, "restaurants", id);
    return await getDoc(docRef);
  }

  async getRestaurantRatings(doc) {
    const ratingsCol = collection(doc.ref, 'ratings');
    const ratingsQuery = query(ratingsCol, orderBy("timestamp", "desc"));
    return await getDocs(ratingsQuery);
  }

  getFilteredRestaurants(filters, renderer) {
    let filtersWhere = [];
    let filtersOrder = [];

    if (filters.category !== 'Any') {
      filtersWhere.push(where("category", "==", filters.category));
    }

    if (filters.city !== 'Any') {
      filtersWhere.push(where("city", "==", filters.city));
    }

    if (filters.price !== 'Any') {
      filtersWhere.push(where("price", "==", filters.price.length));
    }

    if (filters.sort === 'Rating') {
      filtersOrder.push(orderBy('avgRating', 'desc'));
    } else if (filters.sort === 'Reviews') {
      filtersOrder.push(orderBy('numRatings', 'desc'));
    }

    const restaurantsCol = collection(this.db, 'restaurants');
    const filtersQuery = query(
      restaurantsCol, 
      ...filtersWhere, 
      ...filtersOrder
    );

    this.getDocumentsInQuery(filtersQuery, renderer);
  }

  async addRating(restaurantID, rating) {
    try {
      const docRef = doc(this.db, "restaurants", restaurantID);
      const ratingsCol = collection(docRef, 'ratings');
      const ratingsDocRef = doc(ratingsCol);

      await runTransaction(this.db, async (transaction) => {
        const ratingsDoc = await transaction.get(docRef);
        const data = ratingsDoc.data();
        const newAverage =
            (data.numRatings * data.avgRating + rating.rating) /
            (data.numRatings + 1);

        return transaction.set(ratingsDocRef, {
          numRatings: data.numRatings + 1,
          avgRating: newAverage,
          ...rating,
        }, { merge: true });
      });
    } catch (e) {
      console.error(e);
    }
  }

  checkForEmpty(callback) {
    const restaurantsCol = collection(this.db, "restaurants");
    const restaurantsQuery = query(restaurantsCol, limit(1));
    onSnapshot(restaurantsQuery, snapshot => {
      callback(snapshot);
    });
  }
}
