

<div class="admin-layout">
    <nav>
        <a href="/admin"><h2>Admin</h2></a>
        <a href="/admin/users"><h2>Users</h2></a>
        <a href="/admin/profiles"><h2>Profiles</h2></a>
    </nav>
    <slot />
</div>

<style>
    .admin-layout {
        display: grid;
        grid-template-columns: 20rem auto;
        grid-template-areas: "nav main";
        background-color: var(--background-community-main-light);
        height: 100vh;
		column-gap: 0.1rem;
    }

    nav {
		grid-area: nav;
		display: flex;
		flex-direction: column;
		justify-content: first;
        padding: 2rem 2rem;
        gap: 1rem;
        background-color: white;
	}

    nav h2 {
        text-align: center;
    }

    nav a {
        margin: 0.5rem 0;
        padding: 1rem 0;
    }

    nav a:hover {
        background-color: rgb(231, 231, 232);
    }


</style>