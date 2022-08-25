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

<Header />

{#if data.user}
    <h1>hi</h1>
{/if}

<main>
    <slot></slot>
</main>