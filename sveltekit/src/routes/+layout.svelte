<script lang="ts">
    import { page } from '$app/stores';
    import Header from "$lib/components/header/header.svelte";
    import type { LayoutServerData } from './$types';
    import '../app.css';
	import MoreOutlined from "$lib/components/icons/more-outlined.svelte";
	import ForefinderGolf from "$lib/components/icons/forefinder-golf.svelte";
	import MessageIcon from "$lib/components/icons/message-icon.svelte";

    export let data: LayoutServerData;

  </script>

<svelte:head>
    <title>{$page.data.pageTitle}</title>
</svelte:head>



{#if data.user}
    <Header user={data.user} logoutToken={data.logout_token} />
{/if}

<main>
    <div class="navbar">
        <div class="top-nav">
            <a href="/messages" class="rounded-box">
                <MessageIcon width={3.5} height={3.5} />
            </a>
            <div class="community-separator" />
            <a href="/golf/home">
                <ForefinderGolf />
                <h4>Golf</h4>
            </a>
        </div>
        <div class="bottom-nav">
            <button class="rounded-box">
                <MoreOutlined width={3.5} height={3.5} />
            </button>
        </div>
    </div>
    <slot />
</main>

<style>
    main {
        display: grid;
        grid-template-columns: 8rem auto;
        height: 100vh;
    }

    .navbar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: var(--background-community-nav-light);
    }

    .top-nav {
        margin: 1.5rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        align-items: center;
        font-family: Georgia, 'Times New Roman', Times, serif;
        letter-spacing: 0.1rem;
    }

    .bottom-nav {
        margin: 2rem 0;
        display: flex;
        justify-content: center;
    }

    .rounded-box {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: white;
        border-radius: 0.8rem;
        padding: 0.7rem;
        box-shadow: 0 0.4rem 1rem -0.3rem rgb(217, 219, 222);
    }

    .community-separator {
        width: 6rem;
        height: 0.5rem;
        margin: 2rem 2rem;
        background-color: var(--background-community-accent-light);
        border-radius: 0.5rem;
    }

    .top-nav h4 {
        padding: 0;
        margin: 0;
        color: var(--forefinder-green);
    }

    button {
        border: none;
        background-color: none;
        padding: none;
        margin: none;
        cursor: pointer;
    }

    a {
        width: inherit;
        text-decoration: none;
    }

</style>