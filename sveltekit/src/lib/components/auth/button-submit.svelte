<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;
    export let label: string;
</script>

<div>
    <button
        type="submit"
        name={attributes.name}
        value={attributes.value}
        disabled={attributes.disabled}
    >{label}</button>
    {#if messages}
        {#each messages as message}
            <div class="typography-caption">
                { message }
            </div>
        {/each}
    {/if}
</div>

<style>
    button {
        width: 22rem;
        height: 3rem;
        border: none;
        background-color: var(--pine-tree-green);
        color: var(--pure-white);
        align-items: center;
        cursor: pointer;
        user-select: none;
        font-weight: 500;
        transition: background-color 0.2s;
		transition-timing-function: ease;
    }

    button:hover {
        background-color: var(--pine-tree-green-hover);
    }

    button:active {
        background-color: var(--pine-tree-green-active);
    }
</style>