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
			return {
				status: 302,
				redirect: '/login'
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
    import InputEmail from "$lib/components/auth/input-email.svelte";
    import InputPassword from "$lib/components/auth/input-password.svelte";
	import ButtonSubmit from "$lib/components/auth/button-submit.svelte";


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
                    {#if attributes.type === "hidden" }
                        <input
                            name={attributes.name}
                            type="hidden"
                            value={attributes.value}
							required={attributes.required}
							disabled={attributes.disabled}
                        />
                    {/if}
                    {#if attributes.type === "text" }
                        <InputEmail {attributes} {messages} />
                    {/if}
                    {#if attributes.type === "password" }
                        <InputPassword {attributes} {messages} />
                    {/if}
					{#if attributes.type === "submit" }
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
        padding-top: 8rem;
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
