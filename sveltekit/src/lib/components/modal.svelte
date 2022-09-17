<script lang="ts">
    let shown = false;

    function show() {
        shown = true;
    }

    function hide() {
        shown = false;
    }

    function toggle() {
        shown = !shown;
    }
</script>

{#if shown}
    <slot/>
{/if}