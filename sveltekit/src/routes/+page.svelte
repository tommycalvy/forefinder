<script lang="ts">
    import type { PageServerData } from "./$types";
	import { colorGenerator } from "$lib/utils/color-generator";
    export let data: PageServerData;

	let color = "hsl(150, 100%, 50%)";

	function newColor() {
		color = colorGenerator();
		console.log('color: ', color);
	}
</script>



<section>
	<h1>forefinder <br /> Hello World</h1>
	<br />
	<br />

	{#if data.user}
		<h1>Hello {data.user.name}!</h1>
	{:else}
		<a href="/login"><button>Log In</button></a>
		<p>or</p>
		<a href="/registration"><button>Sign Up</button></a>
	{/if}
	<br>
	<br>
	<br>
	<button on:click={newColor}>New Color</button>
	<div class="user-circle" style="background-color: {color}">
		<span>{data.user?.name.charAt(0).toUpperCase() ?? 'T'}</span>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
        text-align: center;
	}

	h1 {
		width: 100%;
	}

	.user-circle {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}


	.user-circle span {
		text-align: center;
		color: var(--pure-white);
		font-size: large;
	}
</style>