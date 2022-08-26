<script>

import { createEventDispatcher } from 'svelte';

import DialogBase from "./dialog-base.svelte";
export let opened = false;

const dispatch = createEventDispatcher();

function onAccept() {
    opened = false;
    dispatch('accept');
}

function onCancel(event) {
    opened = false;
    dispatch('cancel');
}

</script>

{#if opened}
    <DialogBase on:accept={onAccept} on:cancel={onCancel}>
        <slot/>
    </DialogBase>
{/if}
