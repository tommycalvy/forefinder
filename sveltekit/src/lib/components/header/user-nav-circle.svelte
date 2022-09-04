<script lang="ts">
    import { goto } from "$app/navigation";

    import type { User } from '$lib/auth'
    export let user: User;

    export let logoutToken: string;

    let showCard: boolean = false;
    
    function toggleCard() {
        showCard = !showCard;
    }

    async function handleLogout() {
        const logoutHeaders = logoutToken ? new Headers({ "logout_token": logoutToken }) : undefined;
        const res = await fetch('/logout', {
            method: 'POST',
            headers: logoutHeaders
        });
        if (res.ok) {
            const redirectTo = res.headers.get('location') ?? '/login';
            goto(redirectTo);
        } else {
            console.log(res);
        }
    }
</script>
<div class="user-circle" on:click={toggleCard}>
    <div class="user-image" style="background-color: {user.color}">
        <span>{user.name.charAt(0).toUpperCase()}</span>
    </div>
</div>

<div class="account-card" style="display: {showCard ? 'flex' : 'none'}">
    <div class="user-image" style="background-color: {user.color}; width: 5rem; height: 5rem; cursor: default;">
        <span style="font-size: xx-large;">{user.name.charAt(0).toUpperCase()}</span>
    </div>
    <br>
    <h2>{user.name}</h2>
    <h5>{user.email}</h5>
    {#if !user.verified}
        <br>
        <a href="/verification"><button on:click={toggleCard}>Verify Email</button></a>
    {/if}
    <hr>
    <a href="/settings"><button on:click={toggleCard}>Account Settings</button></a>
    <br>
    <button on:click={handleLogout}>Log Out</button>
</div>


<style>
    .user-image {
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 50%;
    }

    .user-circle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 50%;
        width: 2.8rem;
        height: 2.8rem;
        background-color: none;
        align-items: center;
        cursor: pointer;
    }

    .user-circle:hover {
        background-color: var(--hover-color);
		transition: background-color 0.2s;
		transition-timing-function: ease;
    }

    span {
        text-align: center;
		color: var(--pure-white);
		font-size: large;
        user-select: none;
    }

    .account-card {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        position: absolute;
        z-index: 2;
        background-color: var(--pure-white);
        transform-origin: right top;
        right: 2rem;
        top: 5.5rem;
        padding: 2rem 1rem 1rem 1rem;
        width: 15rem;

        box-shadow: 0px 1px 6px 0px var(--shadow-color);
    }

    .account-card h5, .account-card h3, .account-card h2 {
        margin: 0;
        
    }
</style>