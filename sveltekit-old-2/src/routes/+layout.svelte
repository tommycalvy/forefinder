<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';
	import { page } from '$app/stores';

</script>

{#if $page.data }
	<Header />
{/if}

<main>
	<slot />
</main>

<style>
</style>
