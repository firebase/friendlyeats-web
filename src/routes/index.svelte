<script>

import HeaderBase from '../components/header-base.svelte';
import ListRestaurants from '../components/list-restaurants.svelte';
import FilterDialog from '../components/filter-dialog.svelte';
import { mountComponent } from '../lib/renderer';
import { router } from 'tinro';

export let that = null;

function showFilters(event) {
    const dialogEl = document.createElement('aside');
    dialogEl.classList.add("mdc-dialog");
    mountComponent(dialogEl, FilterDialog, { filters:that.filters });
    const dialog = new mdc.dialog.MDCDialog(dialogEl);
    document.body.append(dialogEl);

    dialog.listen('MDCDialog:accept', () => {
        router.goto('/');
    });

    dialog.show();
}

</script>

<div class="header"><HeaderBase filters={that.filters} on:open-dialog={showFilters}/></div>
<main><ListRestaurants {that}/></main>
