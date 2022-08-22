<script>

import { categories, cities } from '../lib/data';

export let filters = {};

let page = "all";

function goBack() {
    page = 'all';
}

</script>

<div class="mdc-dialog__surface">
  {#if page === "all"}
    <header class="mdc-dialog__header">
      <i class="material-icons">filter_list</i>
      <h2 id="mdc-dialog-with-list-label" class="mdc-dialog__header__title">
        Filter
      </h2>
    </header>
    <section class="mdc-dialog__body mdc-dialog__body--scrollable">
        <ul class="template mdc-list" id="all-filters-list">
            <li id="show-page-category" class="mdc-list-item" data-mdc-auto-init="MDCRipple" on:click={() => page = 'category'}>
              <i class="material-icons">fastfood</i>
              {#if filters.category}<b>{filters.category}</b>{:else}<span>Any Category</span>{/if}
            </li>
            <li id="show-page-city" class="mdc-list-item" data-mdc-auto-init="MDCRipple" on:click={() => page = 'category'}>
              <i class="material-icons">location_on</i>
              {#if filters.city}<b>{filters.city}</b>{:else}<span>Any Location</span>{/if}
            </li>
            <li id="show-page-price" class="mdc-list-item" data-mdc-auto-init="MDCRipple" on:click={() => page = 'price'}>
              <i class="material-icons">monetization_on</i>
              {#if filters.price}<b>{filters.price}</b>{:else}<span>Any Price</span>{/if}
            </li>
            <li id="show-page-sort" class="mdc-list-item" data-mdc-auto-init="MDCRipple" on:click={() => page = 'sort'}>
              <i class="material-icons">sort</i>
              <b>{filters.sort}</b>
            </li>
          </ul>
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">
        Accept
    </button>
    </footer>
  {:else if page == "category"}
    <header class="mdc-dialog__header">
      <i class="material-icons">fastfood</i>
      <h2 id="mdc-dialog-with-list-label" class="mdc-dialog__header__title">
        Category
      </h2>
    </header>
    <section class="mdc-dialog__body mdc-dialog__body--scrollable">
        {#each ['Any'].concat(categories) as item}
            <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">{item}</li>
        {/each}
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button back" on:click={goBack}>Back</button>
    </footer>
    {:else if page == "city"}
    <header class="mdc-dialog__header">
      <i class="material-icons">location_on</i>
      <h2 id="mdc-dialog-with-list-label" class="mdc-dialog__header__title">
        Location
      </h2>
    </header>
    <section class="mdc-dialog__body mdc-dialog__body--scrollable">
        {#each ['Any'].concat(cities) as item}
            <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">{item}</li>
        {/each}
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button back" on:click={goBack}>Back</button>
    </footer>
    {:else if page == "price"}
    <header class="mdc-dialog__header">
      <i class="material-icons">monetization_on</i>
      <h2 id="mdc-dialog-with-list-label" class="mdc-dialog__header__title">
        Price
      </h2>
    </header>
    <section class="mdc-dialog__body mdc-dialog__body--scrollable">
      <ul class="mdc-list">
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">Any</li>
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">$</li>
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">$$</li>
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">$$$</li>
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">$$$$</li>
      </ul>
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button back" on:click={goBack}>Back</button>
    </footer>
    {:else if page == "sort"}
    <header class="mdc-dialog__header">
      <i class="material-icons">sort</i>
      <h2 id="mdc-dialog-with-list-label" class="mdc-dialog__header__title">
        Sort By
      </h2>
    </header>
    <section class="mdc-dialog__body mdc-dialog__body--scrollable">
      <ul class="mdc-list">
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">Rating</li>
        <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">Reviews</li>
      </ul>
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button back" on:click={goBack}>Back</button>
    </footer>
  {/if}
</div>
<div class="mdc-dialog__backdrop" />
