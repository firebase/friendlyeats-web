<script>

export let values = {};

let starBase;

function starElements() {
    return Array.from(starBase.children);
}

function setStars(n) {
    starElements().forEach((el, index) => {
        el.innerText = (index < n) ? 'star' : 'star_border';
    });
}

function hoveringStarIndex(el) {
    return starElements().findIndex(child => child.isSameNode(el)) + 1;
}

function onMouseover(event) {
    const el = event.target;
    if (el.tagName.toLowerCase() === 'i') {
        const hoveringRating = hoveringStarIndex(el);
        if (hoveringRating > 0) {
            setStars(hoveringRating);
        } else {
            setStars(values.rating);
        }
    }
}

function onClick(event) {
    const el = event.target;
    if (el.tagName.toLowerCase() === 'i') {
        values.rating = hoveringStarIndex(el);
    }
}

function onLeave(event) {
    setStars(values.rating);
}

</script>

<div class="mdc-dialog__surface">
    <header class="mdc-dialog__header">
        <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
            Add a Review
        </h2>
    </header>
    <section class="mdc-dialog__body">
        <div class="star-input" on:mouseover={onMouseover} on:mouseleave={onLeave} on:click={onClick} bind:this={starBase}>
            <i class="material-icons">star_border</i>
            <i class="material-icons">star_border</i>
            <i class="material-icons">star_border</i>
            <i class="material-icons">star_border</i>
            <i class="material-icons">star_border</i>
        </div>
        <textarea id="text" bind:value={values.text}></textarea>
    </section>
    <footer class="mdc-dialog__footer">
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Cancel</button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">Save</button>
    </footer>
</div>
<div class="mdc-dialog__backdrop"></div>
