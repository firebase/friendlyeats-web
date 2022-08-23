<script>

export let value = 0;

</script>

<div class="rating">
    {#each [0, 1, 2, 3, 4] as r}
        {#if r < value}
            <i class="template material-icons">star</i>
        {:else}
            <i class="template material-icons">star_border</i>
        {/if}
    {/each}
</div>
