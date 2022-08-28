import { get, writable } from "svelte/store";
import { allRestaurantsQuery, filteredRestaurantsQuery, getRestrantCount, restaurantReviewsQuery } from "./firestore";
import { onSnapshot } from 'firebase/firestore';


function makeUpdater(store) {
    return (snapshot) => {
        let list = get(store);

        if (list === undefined) {
            list = [];
        }

        snapshot.docChanges().forEach(({ type, doc, newIndex, oldIndex }) => {
            switch (type) {
                case 'added':
                    if (newIndex >= list.length) {
                        list.push(doc);
                    } else {
                        list.splice(newIndex, 0, doc);
                    }
                    break;

                case 'modified':
                    console.log({ type, doc, newIndex, oldIndex });
                    list.splice(oldIndex, 1);
                    list.splice(newIndex, 0, doc);
                    break;

                case 'removed':
                    list.splice(oldIndex, 1);
                    break;
            }
        });

        store.set(list);
    };
}

function generateSnapshotStore(query) {
    const store = writable(undefined, () => {
        // Got a first subscriber. Start listening
        const updater = makeUpdater(store);
        const finish = onSnapshot(query, updater);
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
