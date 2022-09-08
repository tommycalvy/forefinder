<script lang="ts">
	import { isUiNodeInputAttributes } from '$lib/utils/ui';
	import InputText from '$lib/components/auth/input-text.svelte';
	import ButtonSubmit from '$lib/components/auth/button-submit.svelte';
	import Messages from '$lib/components/auth/messages.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	console.log(data.ui);
</script>

<div class="auth-container">
	<div class="card">
		<h2>Forgot your password?</h2>
		<p>
			Please enter the email address associated with your forefinder account, and we'll email you a link to
			reset your password.
		</p>
		<br />
		<form
			action={data.ui.action}
			method={data.ui.method}
			enctype="application/x-www-form-urlencoded"
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
					{#if attributes.name === 'email'}
						<InputText label="Email" type="email" {attributes} {messages} />
					{/if}
					{#if attributes.type === 'submit'}
						<ButtonSubmit label="Submit" {attributes} {messages} />
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

	form {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		row-gap: 1.5rem;
	}

	h2 {
		margin: 0;
	}

	p {
		width: 23rem;
	}
</style>
