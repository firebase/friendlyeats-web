<script>

export let says = "Bluh bluh bluh";

</script>

<div id="guy-container" class="mdc-toolbar-fixed-adjust">
    <img alt="guy says..." class="guy" src="/images/guy_fireats.png" />
    <div class="text">
        {says}
    </div>

    <slot>
    </slot>
</div>
