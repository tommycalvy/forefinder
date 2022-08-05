<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, url, fetch }) => {
		if (session.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		const flowId = url.searchParams.get('flow') ?? undefined;
		const returnTo = url.searchParams.get('return_to') ?? undefined;

		const headersInit =
			flowId && returnTo
				? new Headers({ flow_id: flowId, return_to: returnTo })
				: flowId
				? new Headers({ flow_id: flowId })
				: undefined;

		const res = await fetch('/auth/login', {
			headers: headersInit
		});
        
		if (!res.ok) {
			const redirectTo = await res.json();
			return {
				status: 302,
				redirect: redirectTo
			};
		}
        
		const { id, ui, refresh, requested_aal } = await res.json();

        
		if (!flowId) {
			const url = returnTo ? `/login?flow=${id}&return_to=${returnTo}` : `/login?flow=${id}`;
			return {
				status: 302,
				redirect: url
			};
		}
        
		return {
			props: { ui, refresh, requested_aal }
		};
	};
</script>

<script lang="ts">
	import type { UiContainer, AuthenticatorAssuranceLevel } from '@ory/kratos-client';
	import '../app.css';
    import { isUiNodeInputAttributes } from "$lib/utils/ui";
    import InputText from "$lib/components/auth/input-text.svelte";
    import InputPassword from "$lib/components/auth/input-password.svelte";

	export let ui: UiContainer;
	export let refresh: boolean;
	export let requested_aal: AuthenticatorAssuranceLevel;
        
   console.log(ui);
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

		<form action={ui.action} method={ui.method} enctype="application/x-www-form-urlencoded">
			{#if ui.messages}
				{#each ui.messages as { id, text }}
					<div class="message" data-testid="ui/message/{{ id }}">{{ text }}</div>
				{/each}
			{/if}
			{#each ui.nodes as { attributes, messages } }
				{#if isUiNodeInputAttributes(attributes)}
                    {#if attributes.type === "text" }
                        <InputText {attributes} {messages} />
                    {/if}
                    {#if attributes.type === "hidden" }
                        <input
                            name={attributes.name}
                            type="hidden"
                            value={attributes.value} 
                        />
                    {/if}
                    {#if attributes.type === "password" }
                        <InputPassword {attributes} {messages} />
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
        padding-top: 8rem;
	}
</style>
