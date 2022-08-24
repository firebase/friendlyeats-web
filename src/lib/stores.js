import { writable } from "svelte/store";
import { getAllRestaurants, getFilteredRestaurants } from "./firestore";


export function getRestaurants(filters) {
    let restaurants = [];
    const store = writable(restaurants);

    const update = (snapshot) => {
        if (!snapshot.size) {
            restaurants = [];
        } else {
            snapshot.docChanges().forEach(function(change) {
                const id = change.doc.id;
                const found = restaurants.findIndex(doc => doc.id === id);
                if (change.type === 'removed') {
                    restaurants.splice(found, 1);
                } else {
                    if (found >= 0) {
                        restaurants[found] = change.doc;
                    } else {
                        restaurants.push(change.doc);
                    }
                }
            });
        }

        store.set(restaurants);
    };

    if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
        getFilteredRestaurants({
            city: filters.city || 'Any',
            category: filters.category || 'Any',
            price: filters.price || 'Any',
            sort: filters.sort
        }, update);
    } else {
        getAllRestaurants(update);
    }
    
    return { subscribe: store.subscribe };
}
