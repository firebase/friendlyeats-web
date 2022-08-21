<script>
    export let hasSectionHeader = false;
</script>

<header id="site-header" class="mdc-toolbar mdc-toolbar--fixed">
    <div id="title" class="mdc-toolbar__row mdc-layout-grid">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
        <span class="material-icons mdc-toolbar__icon--menu">restaurant</span>
        <span class="mdc-toolbar__title">FriendlyEats</span>
    </section>
    </div>
    {#if hasSectionHeader}
    <div id="section-header"></div>
    {/if}
</header>
