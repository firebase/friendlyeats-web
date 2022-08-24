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

export function addRestaurant(data) {
    var collection = firebase.firestore().collection('restaurants');
    return collection.add(data);
}
  
export function getAllRestaurants(update) {
    return firebase.firestore()
                            .collection('restaurants')
                            .orderBy('avgRating', 'desc')
                            .limit(50)
                            .onSnapshot(update);
}
  
export function getRestaurant(id) {
    return firebase.firestore().collection('restaurants').doc(id).get();
}
  
export function getFilteredRestaurants(filters, update) {
    var query = firebase.firestore().collection('restaurants');
    
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
    
    query.onSnapshot(update);
}
  
export function addRating(restaurantID, rating) {
    var collection = firebase.firestore().collection('restaurants');
    var document = collection.doc(restaurantID);
    var newRatingDocument = document.collection('ratings').doc();
    console.log(rating);

    return firebase.firestore().runTransaction(function(transaction) {
        return transaction.get(document).then(function(doc) {
            var data = doc.data();

            var newAverage =
                (data.numRatings * data.avgRating + rating.rating) /
                (data.numRatings + 1);

            transaction.update(document, {
                numRatings: data.numRatings + 1,
                avgRating: newAverage
            });
            return transaction.set(newRatingDocument, rating);
        });
    });
}
