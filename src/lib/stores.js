import { get, writable } from "svelte/store";
import { getAllRestaurants, getFilteredRestaurants, getRestrantCount, getReviewsOfRestaurant } from "./firestore";


function makeUpdater(store) {
    return (snapshot) => {
        let list = get(store);

        if (!snapshot.size) {
            list = [];
        } else {
            if (list === undefined) {
                list = [];
            }
            snapshot.docChanges().forEach(function(change) {
                const id = change.doc.id;
                const found = list.findIndex(doc => doc.id === id);
                if (change.type === 'removed') {
                    list.splice(found, 1);
                } else {
                    if (found >= 0) {
                        list[found] = change.doc;
                    } else {
                        list.push(change.doc);
                    }
                }
            });
        }

        store.set(list);
    };
}

function makeLiveResultStore() {
    const store = writable(undefined);
    return {
        store: { subscribe: store.subscribe },
        updater: makeUpdater(store),
    };
}

export function getRestaurants(filters) {
    const {store, updater} = makeLiveResultStore();

    if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
        getFilteredRestaurants({
            city: filters.city || 'Any',
            category: filters.category || 'Any',
            price: filters.price || 'Any',
            sort: filters.sort
        }, updater);
    } else {
        getAllRestaurants(updater);
    }
    
    return store;
}

export function getReviews(doc) {
    const {store, updater} = makeLiveResultStore();

    getReviewsOfRestaurant(doc, updater);
    
    return store;
}

export function restrantIsEmpty() {
    const store = writable(undefined);
    getRestrantCount(count => store.set(!count));
    return { subscribe: store.subscribe };
}
