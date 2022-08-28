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

export function restaurants() {
    return firebase.firestore().collection('restaurants');
}

export function addRestaurant(data) {
    return restaurants().add(data);
}
  
export function allRestaurantsQuery() {
    return restaurants().orderBy('avgRating', 'desc').limit(50);
}

export function getRestrantCount(update) {
    return restaurants().limit(1).onSnapshot(snapshot => {
        update(snapshot.size);
    });
}

export function getRestaurant(id) {
    return restaurants().doc(id).get();
}

export function filteredRestaurantsQuery(filters) {
    var query = restaurants();
    
    if (filters.category !== 'Any') {
        query = query.where('category', '==', filters.category);
    }
    
    if (filters.city !== 'Any') {
        query = query.where('city', '==', filters.city);
    }
    
    if (filters.price !== 'Any') {
        query = query.where('price', '==', filters.price.length);
    }
    
    if (filters.sort === 'Rating') {
        query = query.orderBy('avgRating', 'desc');
    } else if (filters.sort === 'Reviews') {
        query = query.orderBy('numRatings', 'desc');
    }
    
    return query;
}

export function restaurantRaitings(doc) {
    return doc.ref.collection('ratings');
}

export function restaurantReviewsQuery(doc) {
    return restaurantRaitings(doc).orderBy('timestamp', 'desc');
}

export function addRating(restaurantID, rating) {
    var restrantDoc = restaurants().doc(restaurantID);
    const newDoc = restaurantRaitings(doc).doc();

    firebase.firestore().runTransaction(async (transaction) => {
        transaction.set(newDoc, rating);
        const doc = await transaction.get(restrantDoc);
        var data = doc.data();

        var newAverage =
            (data.numRatings * data.avgRating + rating.rating) /
            (data.numRatings + 1);

        transaction.update(restrantDoc, {
            numRatings: data.numRatings + 1,
            avgRating: newAverage
        });
    });
}
