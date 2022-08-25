<script>

import { addMockRestaurants } from '../lib/mock';


export let that = null;
export let config = {};

that.addingMockData = false;

function add(event) {
  if (that.addingMockData) {
    return;
  }
  that.addingMockData = true;

  addMockRestaurants().then(function() {
    that.addingMockData = false;
  });
}

</script>

<div id="guy-container" class="mdc-toolbar-fixed-adjust">
    <img class="guy" src="/images/guy_fireats.png" alt=FireEats/>
    <div class="text">
    This app is connected to the Firebase project "<b data-fir-content="projectId">{config.projectId}</b>".<br />
    <br />
    Your Cloud Firestore has no documents in <b>/restaurants/</b>.
    </div>
    <br />
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="mdc-button" class:working={that.addingMockData} on:click={add}>
        {#if that.addingMockData}
            Please wait...
        {:else}
            Add mock data
        {/if}
    </a>
</div>

<style>
    .working {
        opacity: 0.4;
    }
</style>