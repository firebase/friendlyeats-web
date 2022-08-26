<script>

import HeaderBase from '../components/header-base.svelte';
import ListRestaurants from '../components/list-restaurants.svelte';
import FilterDialog from '../components/filter-dialog.svelte';
import Dialog from '../components/dialog.svelte';

export let that = null;

let filters = that.filters;
let filtersEditing;
let dialogOpened = false;

function showFilters(event) {
    filtersEditing = {...filters};
    dialogOpened = true;
}

function onAccept(event) {
    dialogOpened = false;
    filters = {...filtersEditing};
}

function onCancel(event) {
    dialogOpened = false;
}

</script>

<div class="header"><HeaderBase {filters} on:open-dialog={showFilters}/></div>
<main><ListRestaurants {that} {filters}/></main>
{#if dialogOpened}
    <Dialog on:accept={onAccept} on:cancel={onCancel}>
        <FilterDialog filters={filtersEditing}/>
    </Dialog>
{/if}
