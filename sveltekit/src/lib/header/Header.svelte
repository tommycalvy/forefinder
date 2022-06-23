<script lang="ts">
	import { page } from '$app/stores';
	import HomeFilled from '$lib/icons/home-filled.svelte';
	import HomeOutlined from '$lib/icons/home-outlined.svelte';
	import MessageFilled from '$lib/icons/messages-filled.svelte';
	import MessageOutlined from '$lib/icons/messages-outlined.svelte';
	import FriendsFilled from '$lib/icons/friends-filled.svelte';
	import FriendsOutlined from '$lib/icons/friends-outlined.svelte';

	import ForefinderLogo from '$lib/forefinder-logo-a.svelte';
	import UserFilled from '$lib/icons/user-filled.svelte';

	const nav = [
		{
			title: 'Home',
			path: '/home',
			icon: {
				filled: HomeFilled,
				outlined: HomeOutlined
			}
		},
		{
			title: 'Friends',
			path: '/friends',
			icon: {
				filled: FriendsFilled,
				outlined: FriendsOutlined
			}
		},
		{
			title: 'Messages',
			path: '/messages',
			icon: {
				filled: MessageFilled,
				outlined: MessageOutlined
			}
		}
	];
</script>

<header>
	<div class="sides">
		<span class="left">
			<ForefinderLogo />
		</span>
	</div>
	<nav class="icon-bar">
		<ul>
			{#each nav as item}
				<li>
					<a href={item.path} data-text={item.title} aria-label={item.title} class:active={$page.url.pathname == item.path}>
						{#if $page.url.pathname == item.path}
							<svelte:component this={item.icon.filled} width={36} height={36} />
						{:else}
							<svelte:component this={item.icon.outlined} width={36} height={36} />
						{/if}
					</a>
					<hr class="bar" class:active={$page.url.pathname == item.path} />
				</li>
			{/each}
		</ul>
	</nav>
	<div class="sides">
		<span class="right">
			<UserFilled width={36} height={36} />
		</span>
	</div>
</header>

<!--padding: 0.2rem 2rem 0.2rem 2rem; -->
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

	.icon-bar ul {
		display: flex;
		height: 3.3rem;
		list-style-type: none;
		margin: 0;
		padding: 0.3rem 0 0 0;
	}

	.icon-bar li {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 0 1rem 0 1rem;
	}

	.icon-bar a {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 6.4rem;
		padding: 0.3rem 0 0.2rem 0;
		border-radius: 0.5rem;
		color: var(--pitch-black);
		text-align: center;
	}

	.icon-bar a:hover {
		background-color: var(--hover-color);
		transition: background-color 0.2s;
		transition-timing-function: ease;
	}

	.icon-bar a:active:hover {
		color: var(--active-color);
	}

	.icon-bar a.active {
		color: var(--pine-tree-green);
	}

	.icon-bar a.active:hover {
		background-color: var(--pure-white);
	}

	.icon-bar a.active:active:hover {
		color: var(--pine-tree-green-active);
	}

	.bar {
		border: 0.1rem solid var(--pure-white);
		margin: 0;
	}

	.bar.active {
		border-color: var(--pine-tree-green);
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

	.icon-bar a::before {
		content: attr(data-text); 
		position: absolute;
		
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 0.5rem;
		
		padding: 10px;
		font-size: small;
		opacity: 0;
		border-radius: 10px;
		background-color: var(--pitch-black);
		color: var(--pure-white);
		text-align: center;
		visibility: hidden;
		
	}

	.icon-bar:hover a::before {
		opacity: 0.7;
		transition: opacity 0.1s;
		transition-delay: 0.4s;
		transition-timing-function: ease;
	}

	.icon-bar a:hover::before {
		visibility: visible;
	}

</style>