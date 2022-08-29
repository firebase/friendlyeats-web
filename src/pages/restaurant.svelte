<script>

import { meta } from 'tinro';
import Dialog from '../components/dialog.svelte';
import RestaurantHeader from '../components/restaurant-header.svelte';
import RestaurantReviews from '../components/restaurant-reviews.svelte';
import { getRestaurant, addRating } from '../lib/firestore';
import AddReview from '../components/add-review.svelte';
import Guy from '../components/guy.svelte';
import { auth } from '../lib/firebase';

const route = meta();
const id = route.params['id'];

let adding = false;
let values = undefined;

function openReview(event) {
    values = {
        rating: 0,
        text: '',
    };
    adding = true;
}

function onAccept(event) {
    addRating(id, {
        ...values,
        userName: 'Anonymous (Web)',
        timestamp: new Date(),
        userId: auth.currentUser.uid
    });
}

</script>

{#await getRestaurant(id)}
    <Guy says="Loading restaurant..."/>
{:then doc}
    <div class="header">
        <RestaurantHeader data={doc.data()} on:add={openReview}/>
    </div>
    <main>
        <RestaurantReviews {doc} />
    </main>
{:catch err}
    <Guy says="Not found">
        <pre>{JSON.stringify(err, null, 4)}</pre>
    </Guy>
{/await}

<Dialog bind:opened={adding} on:accept={onAccept}>
    <AddReview {values}/>
</Dialog>
