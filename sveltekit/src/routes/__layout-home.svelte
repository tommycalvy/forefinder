<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import HomeFilled from "$lib/icons/home-filled.svelte";
	import HomeOutlined from "$lib/icons/home-outlined.svelte";
	import MessageFilled from "$lib/icons/messages-filled.svelte";
	import MessageOutlined from "$lib/icons/messages-outlined.svelte";
	import FriendsFilled from "$lib/icons/friends-filled.svelte";
	import FriendsOutlined from "$lib/icons/friends-outlined.svelte";

	import ForefinderLogo from "$lib/forefinder-logo-a.svelte";
	import UserFilled from "$lib/icons/user-filled.svelte";

	const nav = [
		{ title: "Discover Golfers", path: "/home", icon: {
			filled: HomeFilled,
			outlined: HomeOutlined
		} },
		{ title: "Friends", path: "/friends", icon: {
			filled: FriendsFilled,
			outlined: FriendsOutlined
		} },
		{ title: "Messages", path: "/messages", icon: {
			filled: MessageFilled,
			outlined: MessageOutlined
		} }
	];

</script>

<header>
	<div class="sides">
		<span class="left">
			<ForefinderLogo />
		</span>
	</div>
	<nav class="icon-bar">
			{#each nav as item}
				<a href={item.path} title={item.title} class:active={$page.url.pathname == item.path}>
					{#if $page.url.pathname == item.path}
						<svelte:component this={item.icon.filled} width={36} height={36} />
					{:else}
						<svelte:component this={item.icon.outlined} width={36} height={36} />
					{/if}
					<span class="bar" />
				</a>
			{/each}
	</nav>
	<div class="sides">
		<span class="right">
			<UserFilled width={36} height={36} />
		</span>	
	</div>
</header>

<main>
	<slot />
</main>

<style>
	header {
        padding: 0 4rem 0 4rem;
        display: flex;
        align-items: center;
		justify-content: center;
		margin: 0;
		min-height: 3.6rem;
		background-color: var(--pure-white);
	}

	nav {
		display: flex;
		height: 3.6rem;
	}

	.icon-bar a {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 6.4rem;
		margin: 0 1rem 0 1rem;
		padding-top: 0.6rem;
		border-radius: 0.5rem;
		color: var(--pitch-black);
		text-align: center;
	}

	.icon-bar a:hover {
		background-color: var(--hover-color);
	}

	.icon-bar a.active {
		color: var(--pine-tree-green);
	}

	.icon-bar a.active:hover {
		background-color: var(--pure-white);
	}

	.icon-bar span {
		height: 0.2rem;
	}

	.icon-bar a.active span {
		background-color: var(--pine-tree-green);
	}

	.sides {
		flex-grow: 1;
		flex-basis: 0;
	}
	
	.left {
		float: left;
	}

	.right {
		float: right;
	}
</style>

<!--padding: 0.2rem 2rem 0.2rem 2rem; -->