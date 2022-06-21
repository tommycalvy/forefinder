<script lang="ts">
    import logo from '/forefinder-svg-logo-solo-no-bg.svg'
</script>

<a sveltekit:prefetch href="/discover" title="Discover Golfers">
    <span class="logo">
        <h3>forefinder</h3>
        <div>
            <img width="120px" height="120px" src={logo} alt="forefinder logo"/>
        </div>
    </span> 
</a>

<style>

	a {
		text-decoration: none;
	}

	.logo {
		display: flex;
		justify-content: center;
		background-color: #004AAD;
		align-items: center;
		border: none;
		border-radius: 1rem;
		padding: 0.3rem 1rem 0.3rem 1rem;
	}

	.logo h3 {
		color: white;
		margin: 0;
		letter-spacing: 0.1rem;
		font-weight: 400;
	}

	.logo div {
		width: 2rem;
		height: 2.2rem;
	}

	.logo div img {
		position: relative;
		left: -2.8rem;
		top: -2.3rem;
	}
</style>