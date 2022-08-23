<script>

import Rating from "./rating.svelte";

export let that = null;
export let data = {};

function show_add_review() {
    var dialog =  that.dialogs.add_review;
    // Reset the state before showing the dialog
    dialog.root_.querySelector('#text').value = '';
    dialog.root_.querySelectorAll('.star-input i').forEach(function(el) {
        el.innerText = 'star_border';
    });

    dialog.show();
};

</script>
<div id="restaurant-header">
    <header class="mdc-layout__header mdc-layout__header--transparent" style:background-image="url({data.photo})">
        <div class="mdc-layout-grid" style="width: 100%;">
            <div class="mdc-layout-grid__inner">
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                    <a href="/" data-navigo class="material-icons" id="close">close</a>
                </div>
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 info">
                <div class="max_width_600">
                    <h2>{data.name}</h2>
                    <span class="price">{'$'.repeat(data.price)}</span>
                    <div class="raiting"><Rating value={data.avgRating} /></div>
                    <div class="details">
                    <span class="rating"></span>
                    <span>{data.category}</span>
                    <span class="light">●</span>
                    <span>{data.city}</span>
                    </div>
                    <button id="show-add-review" on:click={show_add_review} class="mdc-button fab">
                        <i class="material-icons">add</i>
                    </button>
                </div>
                </div>
            </div>
        </div>
    </header>
</div>
