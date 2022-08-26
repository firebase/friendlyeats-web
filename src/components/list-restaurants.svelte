<script>
import { onMount } from "svelte";
import { getRestaurants } from '../lib/stores';
import RestaurantCard from "./restaurant-card.svelte";

export let filters = {};

$: restaurants = getRestaurants(filters);

let mainEl = null;

onMount(() => {
    // var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
    toolbar.fixedAdjustElement = mainEl;

    mdc.autoInit();
});

</script>

<div
  id="message-cards-container"
  class="mdc-layout-grid mdc-toolbar-fixed-adjust"
  bind:this={mainEl}
>
    {#if $restaurants.length}
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
