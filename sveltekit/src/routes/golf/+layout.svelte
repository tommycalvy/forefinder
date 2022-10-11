<script lang="ts">
	import { page } from '$app/stores';
	import EventsIcon from "$lib/components/icons/events-icon.svelte";
	import ForefinderGolf from "$lib/components/icons/forefinder-golf.svelte";
	import FriendsIcon from "$lib/components/icons/friends-icon.svelte";
	import GolferIcon from "$lib/components/icons/golfer-icon.svelte";
	import HomeIcon from '$lib/components/icons/home-icon.svelte';
	import ProfileIcon from "$lib/components/icons/profile-icon.svelte";
</script>

<div class="golf-layout">
	<div class="golf-title">
		<ForefinderGolf width={3} height={4} />
		<h2>Golf</h2>
	</div>
	<nav>
		<a href="/golf/home">
			<div class="nav-item">
				<HomeIcon />
				<h4>Home</h4>
			</div>
		</a>
		<a href="/golf/discover">
			<div class="nav-item">
				<GolferIcon />
				<h4>Golfers</h4>
			</div>
		</a>
		<a href="/golf/events">
			<div class="nav-item">
				<EventsIcon />
				<h4>Events</h4>
			</div>
		</a>
		<a href="/golf/friends">
			<div class="nav-item">
				<FriendsIcon />
				<h4>Friends</h4>
			</div>
		</a>
		<a href="/golf/profile">
			<div class="nav-item">
				<ProfileIcon />
				<h4>Profile</h4>
			</div>
		</a>
		<button>+ Invite Friend</button>
	</nav>

	<div class="local-title">
		<h2>{$page.data.localTitle}</h2>
	</div>
	<div class="golf-main">
		<slot />
	</div>
</div>

<style>
	.golf-layout {
		display: grid;
		grid-template-columns: 30rem auto;
		grid-template-rows: 7rem auto;
		grid-template-areas:
			'title local'
			'nav main';
		height: 100vh;
		column-gap: 0.1rem;
		background-color: var(--background-community-main-light);
	}

	.golf-title {
		grid-area: title;
		display: flex;
		justify-content: first;
		background-color: white;
        align-items: center;
        padding-left: 8.3rem;
		gap: 1.3rem;
	}

	.local-title {
		grid-area: local;
		display: flex;
		justify-content: center;
		background-color: white;
		align-items: center;
	}

	.golf-main {
		grid-area: main;
		background-color: white;
	}

    nav {
		grid-area: nav;
		display: flex;
		flex-direction: column;
		justify-content: first;
		background-color: white;
        padding: 0 7rem;
        gap: 1rem;
	}

    nav a {
        display: flex;
        justify-content: first;
    }

	.nav-item {
		display: flex;
		justify-content: first;
		align-items: center;
		gap: 1.5rem;
		color: black;
        padding: 1.4rem 2.4rem 1.4rem 1.4rem;
        border-radius: 4rem;
	}

	.nav-item:hover {
		background-color: rgb(231, 231, 232);
	}

	button {
		width: 14rem;
	}

	a {
		text-decoration: none;
	}
</style>
