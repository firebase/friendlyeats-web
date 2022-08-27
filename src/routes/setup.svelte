<script>

import HeaderBase from '../components/header-base.svelte';
import { restrantIsEmpty } from '../lib/stores';
import { router } from 'tinro';
import { addMockRestaurants } from '../lib/mock';
import Guy from '../components/guy.svelte';

const isEmpty = restrantIsEmpty();
isEmpty.subscribe(isEmpty => {
    if (isEmpty !== undefined && !isEmpty) {
        router.goto('/');
    }
});

const config = firebase.app().options;

let adding = false;

function add(event) {
    if (adding) {
        return;
    }
    adding = true;

    addMockRestaurants();
}

</script>

<div class="header"><HeaderBase/></div>
<main>
    <Guy says="">
        <div class="text">
        This app is connected to the Firebase project "<b data-fir-content="projectId">{config.projectId}</b>".<br />
        <br />
        Your Cloud Firestore has no documents in <b>/restaurants/</b>.
        </div>
        <br />
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="mdc-button" class:working={adding} on:click={add}>
            {#if adding}
                Please wait...
            {:else}
                Add mock data
            {/if}
        </a>
    </Guy>
</main>

<style>
.working {
    opacity: 0.4;
}
</style>