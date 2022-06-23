<script lang="ts">
    export let width = 24;
    export let height = 24;

    let scaled = 4;
</script>

<div class="position">
    <svg style="width:{width - scaled}px;height:{height - scaled}px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
    </svg>
</div>

<style>
    .position {
        position: relative;
        top: 5px;
        padding-bottom: 5px;
    }
</style>
