<script>

import { addMockRatings } from '../lib/mock';
import Rating from './rating.svelte';

export let that;
export let id;
export let ratings;

let reviews = [];

if (ratings.size) {
    ratings.forEach(function(rating) {
        var data = rating.data();
        reviews.push(data);
    });
}

function add_mock_data() {
    addMockRatings(id).then(function() {
        that.rerender();
    });
}

</script>

{#if ratings.size}
    <div id="main">
        <div id="message-cards-container" class="mdc-layout-grid">
            <div id="cards" class="mdc-layout-grid__inner">
                {#each reviews as review}
                    <div hidden class="template mdc-layout-grid__cell--span-12" id="review-card">
                        <div class="review max_width_600">
                            <div class="header">
                                <div class="author">
                                    <span class="light">{review.userName}</span>
                                </div>
                                <div class="rating"><Rating value={review.rating}/></div>
                            </div>
                            <div>{review.text}</div>
                        </div>
                  </div>
                {/each}
            </div>
        </div>
    </div>
{:else}
    <div id="no-ratings">
        <div id="guy-container" class="mdc-toolbar-fixed-adjust">
            <img class="guy" src="/images/guy_fireats.png" />
            <div class="text">
                This restaurant has no ratings.<br />
            </div>
            <br />
            <a class="mdc-button" on:click={add_mock_data}>Add mock ratings</a>
        </div>
    </div>
{/if}
