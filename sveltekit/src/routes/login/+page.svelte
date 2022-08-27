<script lang="ts">
	import { isUiNodeInputAttributes } from '$lib/utils/ui';
	import InputText from '$lib/components/auth/input-text.svelte';
	import ButtonSubmit from '$lib/components/auth/button-submit.svelte';
	import Messages from '$lib/components/auth/messages.svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$lib/form';

	export let data: PageServerData;

	console.log(data.ui);

</script>

<div class="auth-container">
	<div class="card">
		<h2>Sign in to forefinder</h2>
		<form
			action={data.ui.action}
			method={data.ui.method}
			enctype="application/x-www-form-urlencoded"
			use:enhance={{
				error: async ({ response }) => {
					const { errors } = await response?.json();
					data.ui = errors.ui;
				}
			}}
		>
			{#if data.ui.messages}
				<Messages messages={data.ui.messages} />
			{/if}
			{#each data.ui.nodes as { attributes, messages }}
				{#if isUiNodeInputAttributes(attributes)}
					{#if attributes.name === 'csrf_token'}
						<input
							name={attributes.name}
							type="hidden"
							value={attributes.value}
							required={attributes.required}
							disabled={attributes.disabled}
						/>
					{/if}
					{#if attributes.name === 'identifier'}
						<InputText
							label="Email Address"
							type="email"
							{attributes}
							{messages}
						/>
					{/if}
					{#if attributes.name === 'password'}
						<InputText
							label="Password"
							type="password"
							{attributes}
							{messages}
						/>
					{/if}
					{#if attributes.type === 'submit'}
						<ButtonSubmit label="Sign In" {attributes} {messages} />
					{/if}
				{/if}
			{/each}
		</form>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		padding-top: 5rem;
	}

	.card {
		display: flex;
		justify-content: center;
		flex-direction: column;
		background-color: var(--pure-white);
		padding: 3rem 3rem;
		box-shadow: 0 4px 4px -4px var(--shadow-color);
	}

	h2 {
		text-align: center;
		margin-bottom: 2rem;
	}

	form {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		row-gap: 1.5rem;
	}
</style>
