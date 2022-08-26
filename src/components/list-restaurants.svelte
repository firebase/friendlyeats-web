<script>
import { getRestaurants } from '../lib/stores';
import RestaurantCard from "./restaurant-card.svelte";

export let filters = {};

$: restaurants = getRestaurants(filters);

</script>

<div id="message-cards-container" class="mdc-layout-grid mdc-toolbar-fixed-adjust">
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
