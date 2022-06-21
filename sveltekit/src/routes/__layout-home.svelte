<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import HomeFilled from "$lib/icons/home-filled.svelte";
	import HomeOutlined from "$lib/icons/home-outlined.svelte";

	let path: string = $page.url.pathname;
	let routes = {
		home: {
			active: false,
			path: "/home"
		},
		friends: {
			active: false,
			path: "/friends"
		},
		messages: {
			active: false,
			path: "/messages"
		},
		profile: {
			active: false,
			path: "/profile"
		}
	}

	path == routes.home.path ? routes.home.active = true : false;
	path == routes.friends.path ? routes.friends.active = true : false;
	path == routes.messages.path ? routes.messages.active = true : false;
	path == routes.profile.path ? routes.profile.active = true: false;
</script>

<header>
	<nav class="icon-bar">
		<a href={routes.home.path} title="Discover Golfers" class:active={routes.home.active}>
			{#if routes.home.active}
				<HomeFilled width={48} height={48} />
			{:else}
				<HomeOutlined width={48} height={48} />
			{/if}
		</a>
			
		
		
	</nav>

	
</header>

<main>
	<slot />
</main>

<style>
	header {
        padding: 0 5rem 0 5rem;
        display: flex;
        align-items: center;
		justify-content: center;
		margin: 0;
		min-height: 4rem;
		background-color: var(--pure-white);
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-bar a {
		padding: 0.2rem 2rem 0.2rem 2rem;
		border-radius: 0.5rem;
	}

	.icon-bar a:hover {
		background-color: var(--hover-color);
	}
</style>
