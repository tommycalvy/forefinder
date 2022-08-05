<script context="module" lang="ts">
	
</script>

<script>
	// we'll edit this later
	let user = false;
</script>

<svelte:head>
	<title>forefinder welcoming</title>
	<meta name="description" content="forefinder welcoming" />
</svelte:head>

<section>
	<h1>forefinder <br /> Hello World</h1>
	<a href="/home">Discover Golfers</a>
	<br />
	<br />
	{#if !user}
		<a href="/login"><button>Log In</button></a>
	{:else}
		<button>Log Out</button>
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
