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
import { db }  from './firebase';
import { collection, runTransaction, where, orderBy, limit, query, onSnapshot, doc, getDoc, addDoc } from 'firebase/firestore';

export function restaurants() {
    return collection(db, 'restaurants');
}

export function addRestaurant(data) {
    return addDoc(restaurants(), data);
}
  
export function allRestaurantsQuery() {
    return query(restaurants(), orderBy('avgRating', 'desc'), limit(50));
}

export function getRestrantCount(update) {
    const q = query(restaurants(), limit(1));
    return onSnapshot(q, snapshot => update(snapshot.size));
}

export function getRestaurant(id) {
    return getDoc(doc(restaurants(), id));
}

export function filteredRestaurantsQuery(filters) {
    const conditions = [];
    
    if (filters.category !== 'Any') {
        conditions.push(where('category', '==', filters.category));
    }
    
    if (filters.city !== 'Any') {
        conditions.push(where('city', '==', filters.city));
    }
    
    if (filters.price !== 'Any') {
        conditions.push(where('price', '==', filters.price.length));
    }
    
    if (filters.sort === 'Rating') {
        conditions.push(orderBy('avgRating', 'desc'));
    } else if (filters.sort === 'Reviews') {
        conditions.push(orderBy('numRatings', 'desc'));
    }
    
    return query(restaurants(), ...conditions);
}

export function restaurantRaitings(ref) {
    return collection(ref, 'ratings');
}

export function restaurantReviewsQuery(doc) {
    return query(restaurantRaitings(doc.ref), orderBy('timestamp', 'desc'));
}

export function addRating(restaurantID, rating) {
    var restrantRef = doc(restaurants(), restaurantID);
    const newDoc = doc(restaurantRaitings(restrantRef));

    runTransaction(db, async (transaction) => {
        const doc = await transaction.get(restrantRef);
        var data = doc.data();

        var newAverage =
            (data.numRatings * data.avgRating + rating.rating) /
            (data.numRatings + 1);

        transaction.update(restrantRef, {
            numRatings: data.numRatings + 1,
            avgRating: newAverage
        });
        transaction.set(newDoc, rating);
    });
}
