<script lang="ts">
    import { page } from '$app/stores';
    import Header from "$lib/components/header/header.svelte";
    import type { LayoutServerData } from './$types';
    import '../app.css';
	import MoreOutlined from "$lib/components/icons/more-outlined.svelte";
	import ForefinderGolf from "$lib/components/icons/forefinder-golf.svelte";
	import MessagesOutlined from "$lib/components/icons/messages-outlined.svelte";
	import MessageIcon from "$lib/components/icons/message-icon.svelte";

    export let data: LayoutServerData;

  </script>

<svelte:head>
    <title>{$page.data.title}</title>
</svelte:head>



{#if data.user}
    <Header user={data.user} logoutToken={data.logout_token} />
{/if}

<main>
    <div class="navbar">
        <div class="top-nav center-item">
            <a href="/messages" class="rounded-box">
                <MessageIcon />
            </a>
        </div>
        <div class="middle-nav center-item">
            <ForefinderGolf />
        </div>
        <div class="bottom-nav center-item">
            <button class="rounded-box">
                <MoreOutlined />
            </button>
        </div>
    </div>
    <slot />
</main>

<style>
    main {
        display: grid;
        grid-template-columns: 10rem auto;
        height: 100vh;
    }

    .navbar {
        border-right: 0.1rem solid gainsboro;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: rgb(62, 61, 68);
    }

    .center-item {
        text-align: center;
    }

    .top-nav {
        margin: 2rem 0;
        display: flex;
        justify-content: center;
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
        background-color: whitesmoke;
        border-radius: 0.8rem;
        padding: 1rem;
    }

    button {
        border: none;
        background-color: none;
        padding: none;
        margin: none;
        cursor: pointer;
    }

    a {
        padding: none;
        margin: none;
        width: none;
    }
</style>