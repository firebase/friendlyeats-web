<script>

import { onMount } from 'svelte';
import { restrantIsEmpty } from '../lib/stores';
import { router } from 'tinro';
import HeaderBase from '../components/header-base.svelte';
import ListRestaurants from '../components/list-restaurants.svelte';
import FilterDialog from '../components/filter-dialog.svelte';
import Dialog from '../components/dialog.svelte';

export let filters = {};
let filtersEditing;
let dialogOpened = false;

function showFilters(event) {
    filtersEditing = {...filters};
    dialogOpened = true;
}

function onAccept(event) {
    filters = {...filtersEditing};
}

onMount(() => {
    var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
    toolbar.fixedAdjustElement = document.querySelector('#message-cards-container');

    mdc.autoInit();
});

const isEmpty = restrantIsEmpty();
isEmpty.subscribe(isEmpty => {
    if (isEmpty) {
        router.goto('/setup');
    }
});

</script>

<div class="header"><HeaderBase {filters} on:open-dialog={showFilters}/></div>
<main><ListRestaurants {filters}/></main>

<Dialog bind:opened={dialogOpened} on:accept={onAccept}>
    <FilterDialog filters={filtersEditing}/>
</Dialog>
