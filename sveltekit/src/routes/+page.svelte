<script lang="ts">
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    /*
    const handleLogout = async () => {
		const logoutHeaders = logoutToken ? new Headers({ logout_token: logoutToken }) : undefined;
		const res = await fetch('/auth/logout', {
			headers: logoutHeaders
		})
		console.log(res);
		//await goto('/login');
	}
    */

</script>



<section>
	<h1>forefinder <br /> Hello World</h1>
	<br />
	<br />

	{#if data.user}
		<h1>Hello {data.user.name}!</h1>
		<button>Log Out</button>
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
        text-align: center;
	}

	h1 {
		width: 100%;
	}
</style>