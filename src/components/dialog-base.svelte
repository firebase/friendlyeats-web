<script>

import { createEventDispatcher, onMount } from 'svelte';

let dialogEl;

const dispatch = createEventDispatcher();

onMount(() => {
    const dialog = new mdc.dialog.MDCDialog(dialogEl);

    dialog.listen('MDCDialog:accept', () => dispatch('accept'));
    dialog.listen('MDCDialog:cancel', () => dispatch('cancel'));

    setTimeout(() => dialog.show(), 1);
});

function noop(node, params) {
    return {
        duration: 120,
        tick() {}
    };
}

</script>

<aside class="mdc-dialog" bind:this={dialogEl} out:noop>
    <slot/>
</aside>

