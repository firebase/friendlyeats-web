<script>

export let value = 0;

</script>

<div id="rating">
    {#each [0, 1, 2, 3, 4] as r}
        {#if r < value}
            <i class="material-icons">star</i>
        {:else}
            <i class="material-icons">star_border</i>
        {/if}
    {/each}
</div>
