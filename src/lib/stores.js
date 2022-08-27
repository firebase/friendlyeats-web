import { get, writable } from "svelte/store";
import { allRestaurantsQuery, filteredRestaurantsQuery, getRestrantCount, restaurantReviewsQuery } from "./firestore";


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

function generateSnapshotStore(query) {
    const store = writable(undefined, () => {
        // Got a first subscriber. Start listening
        const updater = makeUpdater(store);
        const finish = query.onSnapshot(updater);
        return () => {
            // No more subscriber. Stop listening
            finish();
        };
    });

    return { subscribe: store.subscribe };
}

export function getRestaurants(filters) {
    let query;

    if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
        query = filteredRestaurantsQuery({
            city: filters.city || 'Any',
            category: filters.category || 'Any',
            price: filters.price || 'Any',
            sort: filters.sort
        });
    } else {
        query = allRestaurantsQuery();
    }
    
    return generateSnapshotStore(query);
}

export function getReviews(doc) {
    const query = restaurantReviewsQuery(doc);
    return generateSnapshotStore(query)
}

export function restrantIsEmpty() {
    const store = writable(undefined);
    getRestrantCount(count => store.set(!count));
    return { subscribe: store.subscribe };
}
