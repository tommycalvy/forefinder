<script lang="ts">
	import type {
		UiContainer,
		UiNodeInputAttributes,
		AuthenticatorAssuranceLevel
	} from '@ory/kratos-client';
	import '../app.css';
	import { isUiNodeInputAttributes } from '$lib/utils/ui';
	import InputEmail from '$lib/components/auth/input-email.svelte';
	import InputPassword from '$lib/components/auth/input-password.svelte';
	import ButtonSubmit from '$lib/components/auth/button-submit.svelte';
	import Messages from "$lib/components/auth/messages.svelte";
	import { goto } from "$app/navigation";

	export let id: string;
	export let ui: UiContainer;
	export let refresh: boolean;
	export let requested_aal: AuthenticatorAssuranceLevel;

	console.log(ui);

	let fields = ui.nodes.reduce<Record<string, string>>((acc, node) => {
		const { name, value } = node.attributes as UiNodeInputAttributes;
		acc[name] = value || '';
		return acc;
	}, {});

	ui.action = `/auth/login?flow=${id}`;
	const handleSubmit = async () => {
		const formData = new FormData();
		
		for (const name in fields) {
			formData.append(name, fields[name]);
		}
		console.log(formData.get('csrf_token'));
		const res = await fetch(`/auth/login`, {
			method: ui.method,
			body: formData,
			headers: {
				flow_id: id,
				accept: 'application/json'
			}
		});
		switch (res.status) {
			case 200: {
				await goto('/');
				break;
			}
			case 410: {
				const newFlow = res.headers.get('location') ?? undefined;
				console.log(newFlow);
				if (newFlow) {
					await goto(newFlow);
				} else {
					await goto('/login');
				}
				break;
			}
			case 400: {
				const data = await res.json();
				ui = data.ui;
				console.log(ui.messages);
				break;
			}
			case 500: {
				const data = await res.json();
				console.log(data);
				break;
			}
			default: {
				const data = await res.json();
				console.log(data);
				break;
			}
		}
	}
</script>

<div class="auth-container">
	<div class="card">
		{#if refresh}
			<h2>Confirm Action</h2>
		{:else if requested_aal === 'aal2'}
			<h2>Two-Factor Authentication</h2>
		{:else}
			<h2>Sign in to forefinder</h2>
		{/if}

		<form
			on:submit|preventDefault={handleSubmit}
			action={ui.action}
			method={ui.method}
			enctype="application/x-www-form-urlencoded"
		>
			{#if ui.messages}
				<Messages messages={ui.messages} />
			{/if}
			{#each ui.nodes as { attributes, messages }}
				{#if isUiNodeInputAttributes(attributes)}
					{#if attributes.name === 'csrf_token'}
						<input
							name={attributes.name}
							type="hidden"
							bind:value={fields[attributes.name]}
							required={attributes.required}
							disabled={attributes.disabled}
						/>
					{/if}
					{#if attributes.name === 'identifier'}
						<InputEmail {attributes} {messages} bind:value={fields[attributes.name]}/>
					{/if}
					{#if attributes.name === 'password'}
						<InputPassword {attributes} {messages} bind:value={fields[attributes.name]}/>
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