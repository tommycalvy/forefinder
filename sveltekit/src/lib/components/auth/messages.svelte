<script lang="ts">
	import type { UiText } from '@ory/kratos-client';

	import AlertIndicator from '../icons/alert-indicator.svelte';
	export let messages: UiText[];
</script>

{#each messages as { id, text, type }}
	{#if type === 'error'}
		<div class="error-card">
			<AlertIndicator />
			<div class="message" data-testid="ui/message/{id}">{text}</div>
		</div>
	{/if}
	{#if type === 'info'}
		<div class="info-card">
			<AlertIndicator />
			<div class="message" data-testid="ui/message/{id}">{text}</div>
		</div>
	{/if}
{/each}


<style>

    .error-card {
		display: flex;
		width: 20rem;
		padding: 1rem 0.5rem 1rem 1rem;
		color: var(--error-message-color);
		background-color: var(--error-card-color);
		font-size: 0.9rem;
	}

	.message {
		color: inherit;
		padding: 0rem 1rem;
	}

	.info-card {
		/* TODO: Make a nicer info card message */
		display: flex;
		width: 20rem;
		padding: 1rem 0.5rem 1rem 1rem;
		color: var(--error-message-color);
		background-color: var(--error-card-color);
		font-size: 0.9rem;
	}
    
</style>