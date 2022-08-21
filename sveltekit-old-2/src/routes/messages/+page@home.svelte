<script lang="ts">
	import Messages from '$lib/components/messages/Messages.svelte';
</script>

<section>
	<Messages />
    <div class="golfers">
        <h1>Messages</h1>
    </div>
</section>

<style>
     section {
        display: grid;
        column-gap: 1rem;
        grid-template-columns: 22rem auto;
        height: calc(100vh - var(--top-app-bar-height));
        overflow: hidden;
    }

    .golfers {
        display: flex;
        justify-content: center;
    }
</style>
