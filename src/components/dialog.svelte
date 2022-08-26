<script>

import { createEventDispatcher, onMount } from 'svelte';

let dialogEl;

const dispatch = createEventDispatcher();

onMount(() => {
    const dialog = new mdc.dialog.MDCDialog(dialogEl);

    dialog.listen('MDCDialog:accept', () => dispatch('accept'));
    dialog.listen('MDCDialog:cancel', () => dispatch('cancel'));

    dialog.show();
});

</script>

<aside class="mdc-dialog" bind:this={dialogEl}>
    <slot/>
</aside>
