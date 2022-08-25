<script>

import { meta } from 'tinro';
import RestaurantHeader from '../components/restaurant-header.svelte';
import RestaurantReviews from '../components/restaurant-reviews.svelte';
import { getRestaurant, getReviews } from '../lib/firestore';

export let that = null;

const route = meta();
const id = route.params['id'];

</script>
{#await getRestaurant(id)}
    Loading...
{:then doc}
    <div class="header">
        <RestaurantHeader {that} data={doc.data()}/>
    </div>
    {#await getReviews(doc)} ... {:then ratings}
        <main>
            <RestaurantReviews {that} {id} {ratings} />
        </main>
        {:catch err}
            Load error : {JSON.stringify(err)}
        {/await}
{:catch err}
    Load error : {JSON.stringify(err)}
{/await}
