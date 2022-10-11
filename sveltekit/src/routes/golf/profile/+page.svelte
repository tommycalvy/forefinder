<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import FormCreate from '$lib/components/profile/golf/form-create.svelte';

	//export let data: PageServerData;

	export let form: ActionData;

	let random4digit = 'hola';
	function random4digits() {
		return Math.floor((Math.random() * 10000) + 10000).toString().substring(1);
	}
</script>

<!---
	{#if data.profile}
	
{:else}
	<FormCreate success={form?.success} />
{/if}
-->
<button on:click={() => {random4digit = random4digits()}}>New Num</button>
<p>Num: {random4digit}</p>
<FormCreate success={form?.success} />



<style>
</style>
