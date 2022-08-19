<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, url, fetch }) => {
		if (session.user) {
			const res = await fetch('/auth/logout');
			if (res.ok) {
				const { logout_token } = await res.json();
				return {
					props: {
						logoutToken: logout_token
					}
				};
			}
		}
		return {
			props: {
				user: session.user,
				logoutToken: undefined
			}
		};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { User } from "$lib/auth";

	export let logoutToken: string;
	export let user: User;
	console.log('logoutToken: ', logoutToken);

	const handleLogout = async () => {
		const logoutHeaders = logoutToken ? new Headers({ logout_token: logoutToken }) : undefined;
		const res = await fetch('/auth/logout', {
			headers: logoutHeaders
		})
		console.log(res);
		//await goto('/login');
	}
</script>

<svelte:head>
	<title>forefinder homepage</title>
	<meta name="description" content="forefinder homepage" />
</svelte:head>

<section>
	<h1>forefinder <br /> Hello World</h1>
	<br />
	<br />

	{#if user}
		<h1>Hello {user.name}!</h1>
		<button on:click={handleLogout}>Log Out</button>
	{:else}
		<a href="/login"><button>Log In</button></a>
		<p>or</p>
		<a href="/registration"><button>Sign Up</button></a>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
