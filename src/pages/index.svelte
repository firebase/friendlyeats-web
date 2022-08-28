<script>

import { onMount } from 'svelte';
import { router } from 'tinro';
import { getRestaurants, restrantIsEmpty } from '../lib/stores';
import RestaurantCard from "../components/restaurant-card.svelte";
import HeaderBase from '../components/header-base.svelte';
import FilterDialog from '../components/filter-dialog.svelte';
import Dialog from '../components/dialog.svelte';
import Guy from '../components/guy.svelte';

const filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
};

firebase.auth().signInAnonymously().then(() => {
}).catch(function(err) {
    console.log(err);
});

$: restaurants = getRestaurants(filters);

/* filter dialog */

let filtersEditing;
let dialogOpened = false;

function showFilters(event) {
    filtersEditing = {...filters};
    dialogOpened = true;
}

function onAccept(event) {
    filters = {...filtersEditing};
}

/* Material Component Toolbar support */

onMount(() => {
    var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
    toolbar.fixedAdjustElement = document.querySelector('#message-cards-container');

    mdc.autoInit();
});

/* redirect */

const isEmpty = restrantIsEmpty();
isEmpty.subscribe(isEmpty => {
    if (isEmpty) {
        router.goto('/setup');
    }
});

</script>

<div class="header"><HeaderBase {filters} on:open-dialog={showFilters}/></div>
<main>
    <div id="message-cards-container" class="mdc-layout-grid mdc-toolbar-fixed-adjust">
        {#if $restaurants === undefined}
            <Guy says="Loading..."/>
        {:else if $restaurants.length}
            <div id="cards" class="mdc-layout-grid__inner">
                {#each $restaurants as doc(doc.id)}
                    <RestaurantCard id={doc.id} data={doc.data()} />
                {/each}
            </div>
        {:else}
            <div id="no-results">
                <Guy says="There are no results for your those filters!"/>
            </div>
        {/if}
    </div>
</main>

<Dialog bind:opened={dialogOpened} on:accept={onAccept}>
    <FilterDialog filters={filtersEditing}/>
</Dialog>
