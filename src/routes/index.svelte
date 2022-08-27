<script>

import { onMount } from 'svelte';
import { router } from 'tinro';
import { getRestaurants, restrantIsEmpty } from '../lib/stores';
import RestaurantCard from "../components/restaurant-card.svelte";
import HeaderBase from '../components/header-base.svelte';
import FilterDialog from '../components/filter-dialog.svelte';
import Dialog from '../components/dialog.svelte';

export let filters = {};

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
            <div id="guy-container" class="mdc-toolbar-fixed-adjust">
                <img class="guy" src="/images/guy_fireats.png" />
                <div class="text">
                    Loading...
                </div>
            </div>
        {:else if $restaurants.length}
            <div id="cards" class="mdc-layout-grid__inner">
                {#each $restaurants as doc(doc.id)}
                    <RestaurantCard id={doc.id} data={doc.data()} />
                {/each}
            </div>
        {:else}
            <div id="no-results">
                <div id="guy-container" class="mdc-toolbar-fixed-adjust">
                    <img class="guy" src="/images/guy_fireats.png" />
                    <div class="text">
                        There are no results for your those filters!
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>

<Dialog bind:opened={dialogOpened} on:accept={onAccept}>
    <FilterDialog filters={filtersEditing}/>
</Dialog>
