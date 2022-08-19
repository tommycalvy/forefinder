<script context="module" lang="ts">
	
</script>

<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';
	import { session } from "$app/stores";



</script>

{#if $session.user }
	<Header />
{/if}

<main>
	<slot />
</main>

<style>
</style>
