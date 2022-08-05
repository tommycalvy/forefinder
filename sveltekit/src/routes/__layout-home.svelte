<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
        if (session.user) {
            return {
				status: 302,
				redirect: '/'
			};
        }
		return {};
    }
</script>

<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';
</script>


<Header />


<main>
	<slot />
</main>

<style>
</style>
