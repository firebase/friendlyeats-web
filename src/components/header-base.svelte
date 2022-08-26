<script>
    import { descriptionForFilter} from '../lib/query';
    import { mountComponent } from '../lib/renderer';
    import { router } from 'tinro';
    import FilterDialog from './filter-dialog.svelte';

    export let filters = null;

    function showFilters() {
        const dialogEl = document.createElement('aside');
        dialogEl.classList.add("mdc-dialog");
        mountComponent(dialogEl, FilterDialog, { filters });
        const dialog = new mdc.dialog.MDCDialog(dialogEl);
        document.body.append(dialogEl);

        dialog.listen('MDCDialog:accept', () => {
            router.goto('/');
        });

        dialog.show();
    }

</script>

<header id="site-header" class="mdc-toolbar mdc-toolbar--fixed">
    <div id="title" class="mdc-toolbar__row mdc-layout-grid">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
        <span class="material-icons mdc-toolbar__icon--menu">restaurant</span>
        <span class="mdc-toolbar__title">FriendlyEats</span>
    </section>
    </div>
    {#if filters}
        <div id="filter" class="mdc-toolbar mdc-layout-grid">
            <div id="show-filters" on:click={showFilters}>
                <div id="active-filters">
                    <i class="material-icons">filter_list</i>
                    You're seeing <b>{descriptionForFilter(filters)}</b>
                </div>
            </div>
        </div>
    {/if}
</header>
