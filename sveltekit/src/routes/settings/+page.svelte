<script lang="ts">
	import { isUiNodeInputAttributes } from '$lib/utils/ui';
	import InputText from '$lib/components/auth/input-text.svelte';
	import ButtonSubmit from '$lib/components/auth/button-submit.svelte';
	import Messages from '$lib/components/auth/messages.svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$lib/form';
    import { goto } from "$app/navigation";


	export let data: PageServerData;

	console.log(data.ui);
</script>

<div class="auth-container">
	<div class="card">
		<h2>Settings</h2>
        <br>
        <br>
		<form
			action={data.ui.action}
			method={data.ui.method}
			enctype="application/x-www-form-urlencoded"
			use:enhance={{
                result: async ({ response }) => {
                    console.log('hi');
                    if (response) {
                        if (response.status === 200) {
                            const { errors } = await response.json();
                            console.log(errors);
                            if (errors.ui) {
                                data.ui = errors.ui;
                            }
                        }
                    }   
                },
				error: async ({ response }) => {
                    if (response) {
                        if (response.status === 400) {
                            const { errors } = await response.json();
					        data.ui = errors.ui;
                        }
                    }
				},
                redirect: ({ response }) => {
                    console.log('hi2');
                    const redirectTo = response.headers.get('location') ?? undefined;
                    console.log('hi3');
                    console.log('redirectTo: ', redirectTo);
                    console.log(response);
                    if (redirectTo) {
                        console.log('hi4');
                        goto(redirectTo);
                    }
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
					{#if attributes.name === 'traits.email'}
						<InputText label="Email Address" type="email" {attributes} {messages} value={attributes.value}/>
					{/if}
                    {#if attributes.name === 'traits.name.first'}
                        <InputText label="Name" {attributes} {messages} value={attributes.value} />
                    {/if}
                    {#if attributes.name === 'password'}
						<InputText label="Password" type="password" {attributes} {messages} value={attributes.value}/>
					{/if}
					{#if attributes.type === 'submit'}
						<ButtonSubmit label="Save" {attributes} {messages} />
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