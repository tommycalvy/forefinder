<script lang="ts">
    import { page } from '$app/stores';
    import Header from "$lib/components/header/header.svelte";
    import type { LayoutServerData } from './$types';
    import '../app.css';

    export let data: LayoutServerData;

  </script>

<svelte:head>
    <title>{$page.data.title}</title>
</svelte:head>

{#if data.user}
    <Header user={data.user} logoutToken={data.logout_token} />
{/if}

<main>
    <slot></slot>
</main>