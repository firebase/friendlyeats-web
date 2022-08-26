<script>

import { meta } from 'tinro';
import Dialog from '../components/dialog.svelte';
import RestaurantHeader from '../components/restaurant-header.svelte';
import RestaurantReviews from '../components/restaurant-reviews.svelte';
import { getRestaurant, addRating } from '../lib/firestore';
import AddReview from '../components/add-review.svelte';

export let that = null;

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
        userId: firebase.auth().currentUser.uid
    });
}

</script>

{#await getRestaurant(id)}
    Loading...
{:then doc}
    <div class="header">
        <RestaurantHeader {that} data={doc.data()} on:add={openReview}/>
    </div>
    <main>
        <RestaurantReviews {doc} />
    </main>
{:catch err}
    Load error : {JSON.stringify(err)}
{/await}

<Dialog bind:opened={adding} on:accept={onAccept}>
    <AddReview {values}/>
</Dialog>
