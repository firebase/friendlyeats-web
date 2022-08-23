<script>

import Rating from "./rating.svelte";

export let that = null;
export let id = null;
export let data = null;

function clicked(event) {
    that.router.navigate('/restaurants/' + id);
}

</script>

<div class="template mdc-layout-grid__cell mdc-layout-grid__cell--span-4">
    <div class="location-card mdc-card mdc-shadow--2dp" on:click={clicked}>
        <div class="mdc-card__title" style:background-image="url({data.photo})" />
        <div class="mdc-card__supporting-text">
            <h2>{data.name}</h2>
            <span class="info price">{'$'.repeat(data.price)}</span>
            <div class="details">
                <div class="rating">
                    <Rating value={Math.floor(data.avgRating)} />
                </div>
            </div>
            <div class="details">
                <span class="info">{data.category}</span>
                <span class="light">●</span>
                <span class="info">{data.city}</span>
            </div>
        </div>
    </div>
</div>
