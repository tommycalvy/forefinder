<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import FormCreate from '$lib/components/profile/golf/form-create.svelte';

	export let data: PageServerData;

	export let form: ActionData;
</script>

{#if data.profile}
	
{:else}
	<FormCreate success={form?.success} />
{/if}

<style>
</style>
