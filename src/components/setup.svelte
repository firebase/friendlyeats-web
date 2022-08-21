<script>

export let that = null;
export let config = {};

let addingMockData = false;

function addMockRestaurants(event) {
  if (addingMockData) {
    return;
  }
  addingMockData = true;

  that.addMockRestaurants().then(function() {
    that.rerender();
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
    <a class="mdc-button" class:addingMockData on:click={addMockRestaurants}>
        {#if addingMockData}
            Please wait...
        {:else}
            Add mock data
        {/if}
    </a>
</div>

<style>
    .addingMockData {
        opacity: 0.4;
    }
</style>