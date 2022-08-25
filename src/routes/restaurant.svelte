<script>

import { meta } from 'tinro';
import RestaurantHeader from '../components/restaurant-header.svelte';
import RestaurantReviews from '../components/restaurant-reviews.svelte';
import { getRestaurant } from '../lib/firestore';

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
    <main>
        <RestaurantReviews {doc} />
    </main>
{:catch err}
    Load error : {JSON.stringify(err)}
{/await}
