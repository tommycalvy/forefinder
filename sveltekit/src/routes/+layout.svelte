<script lang="ts">
    import { page } from '$app/stores';
    import Header from "$lib/components/header/header.svelte";
    import type { LayoutServerData } from './$types';
    import '../app.css';
	import MoreOutlined from "$lib/components/icons/more-outlined.svelte";
	import ForefinderGolf from "$lib/components/icons/forefinder-golf.svelte";
	import MessagesOutlined from "$lib/components/icons/messages-outlined.svelte";

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
        <div class="top-nav">
            <MessagesOutlined width={48} height={48} />
            <hr>
            <ForefinderGolf />
        </div>
        <div class="bottom-nav">
            <MoreOutlined />
        </div>
    </div>
    <slot />
</main>

<style>
    main {
        display: grid;
        grid-template-columns: 20rem auto;
    }

    .navbar {
        border: solid 0.1rem black
    }
</style>