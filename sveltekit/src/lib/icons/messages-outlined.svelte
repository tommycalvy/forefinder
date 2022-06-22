<script lang="ts">
    export let width = 24;
    export let height = 24;

    let scaled = 8
</script>

<div class="position">
    <svg style="width:{width - scaled}px;height:{height - scaled}px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16Z" />
    </svg>
</div>

<style>
    .position {
        position: relative;
        top: 0.3rem;
    }
</style>