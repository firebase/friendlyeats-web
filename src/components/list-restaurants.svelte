<script>
import { onMount } from "svelte";
import { getAllRestaurants, getFilteredRestaurants } from '../lib/firestore';
import { replaceElement } from '../lib/renderer';

export let that = null;

let mainEl = null;

onMount(() => {
    const filters = that.filters;
    var renderer = {
        remove: function(doc) {
            var locationCardToDelete = mainEl.querySelector('#doc-' + doc.id);
            if (locationCardToDelete) {
                mainEl.querySelector('#cards').removeChild(locationCardToDelete.parentNode);
            }

            return;
        },
        display: function(doc) {
            var data = doc.data();
            data['.id'] = doc.id;
            data['go_to_restaurant'] = function() {
                that.router.navigate('/restaurants/' + doc.id);
            };
        
            var el = that.renderTemplate('restaurant-card', data);
            el.querySelector('.rating').append(that.renderRating(data.avgRating));
            el.querySelector('.price').append(that.renderPrice(data.price));
            // Setting the id allows to locating the individual restaurant card
            el.querySelector('.location-card').id = 'doc-' + doc.id;
        
            var existingLocationCard = mainEl.querySelector('#doc-' + doc.id);
            if (existingLocationCard) {
                // modify
                existingLocationCard.parentNode.before(el);
                mainEl.querySelector('#cards').removeChild(existingLocationCard.parentNode);
            } else {
                // add
                mainEl.querySelector('#cards').append(el);
            }
        },
        empty: function() {
            var noResultsEl = that.renderTemplate('no-results');

            replaceElement(document.querySelector('main'), noResultsEl);
            return;
        }
    };

    if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
        getFilteredRestaurants({
            city: filters.city || 'Any',
            category: filters.category || 'Any',
            price: filters.price || 'Any',
            sort: filters.sort
    }, renderer);
    } else {
        getAllRestaurants(renderer);
    }

    var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
    toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

    mdc.autoInit();
});

</script>

<div
  id="message-cards-container"
  class="mdc-layout-grid mdc-toolbar-fixed-adjust"
  bind:this={mainEl}
>
    <div id="cards" class="mdc-layout-grid__inner" />
</div>
