<script>

export let doc = null;

var data = doc.data();
data['.id'] = doc.id;

// el.querySelector('.rating').append(that.renderRating(data.avgRating));
// el.querySelector('.price').append(that.renderPrice(data.price));
// // Setting the id allows to locating the individual restaurant card
// el.querySelector('.location-card').id = 'doc-' + doc.id;

function clicked(event) {
    that.router.navigate('/restaurants/' + doc.id);
}

</script>

<div class="template mdc-layout-grid__cell mdc-layout-grid__cell--span-4">
    <div class="location-card mdc-card mdc-shadow--2dp" on:click={clicked}>
        <div class="mdc-card__title" data-fir-style="backgroundImage:photo" />
            <div class="mdc-card__supporting-text">
                <h2>{data.name}</h2>
                <span class="info price" />
                <div class="details">
                <div class="rating" />
                </div>
                <div class="details">
                <span class="info">{data.category}</span>
                <span class="light">●</span>
                <span class="info">{data.city}</span>
            </div>
        </div>
    </div>
</div>
