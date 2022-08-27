<script lang="ts">
	import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';
	import Messages from './messages.svelte';

	export let attributes: UiNodeInputAttributes;
	export let messages: Array<UiText> | undefined;
	export let label: string;
</script>

<fieldset>
	<label>
		<input
			type="submit"
			name={'auth_' + attributes.name}
			value={attributes.value}
            placeholder="Hello World!"
			disabled={attributes.disabled}
		/>
		<span>{label}</span>
	</label>

	{#if messages}
		<Messages {messages} />
	{/if}
</fieldset>

<style>
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
	}

	input {
		width: 22rem;
		height: 3rem;
		border: none;
		background-color: var(--pine-tree-green);
		color: var(--pure-white);
		align-items: center;
		cursor: pointer;
		user-select: none;
		font-weight: 500;
		transition: background-color 0.2s;
		transition-timing-function: ease;
	}

	input:hover {
		background-color: var(--pine-tree-green-hover);
	}

	input:active {
		background-color: var(--pine-tree-green-active);
	}
</style>
