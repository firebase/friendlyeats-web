<script>
import { onMount } from "svelte";
import { getAllRestaurants, getFilteredRestaurants } from '../lib/firestore';
import { replaceElement } from '../lib/renderer';
import RestaurantCard from "./restaurant-card.svelte";

export let that = null;

let mainEl = null;
let restaurants = [];

const filters = that.filters;

function empty() {
    var noResultsEl = that.renderTemplate('no-results');

    replaceElement(document.querySelector('main'), noResultsEl);
    return;
}

const update = (snapshot) => {
    if (!snapshot.size) return empty(); // Display "There are no restaurants".
    
    snapshot.docChanges().forEach(function(change) {
        console.log(change);
        const id = change.doc.id;
        const found = restaurants.findIndex(doc => doc.id === id);
        if (change.type === 'removed') {
            restaurants = [...restaurants.slice(0, found), ...restaurants.slice(found + 1)];
        } else {
            if (found >= 0) {
                restaurants = [...restaurants.slice(0, found), change.doc, ...restaurants.slice(found + 1)];
            } else {
                restaurants = [...restaurants, change.doc];
            }
        }
    });
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

onMount(() => {
    var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
    toolbar.fixedAdjustElement = mainEl;

    mdc.autoInit();
});

</script>

<div
  id="message-cards-container"
  class="mdc-layout-grid mdc-toolbar-fixed-adjust"
  bind:this={mainEl}
>
    <div id="cards" class="mdc-layout-grid__inner">
        {#each restaurants as restaurant(restaurant.id)}
            <RestaurantCard doc={restaurant} />
        {/each}
    </div>
</div>
