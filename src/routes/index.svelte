<script>

import HeaderBase from '../components/header-base.svelte';
import ListRestaurants from '../components/list-restaurants.svelte';
import FilterDialog from '../components/filter-dialog.svelte';
import { mountComponent } from '../lib/renderer';

export let that = null;

let filters = that.filters;

function showFilters(event) {
    const filtersEditing = {...filters};
    const dialogEl = document.createElement('aside');
    dialogEl.classList.add("mdc-dialog");
    mountComponent(dialogEl, FilterDialog, { filters: filtersEditing });
    const dialog = new mdc.dialog.MDCDialog(dialogEl);
    document.body.append(dialogEl);

    dialog.listen('MDCDialog:accept', () => {
        filters = {...filtersEditing};
    });

    dialog.show();
}

</script>

<div class="header"><HeaderBase {filters} on:open-dialog={showFilters}/></div>
<main><ListRestaurants {that} {filters}/></main>
