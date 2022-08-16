<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';
    import Messages from "./messages.svelte";

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;

</script>


<fieldset>
    <div>
        <label>
            <span>{attributes.label?.text}</span>
            <input
                type="text"
                name={attributes.name}
                required={attributes.required}
                value={attributes.value}
            />
        </label>
    </div>
    {#if messages}
        <Messages {messages} />
    {/if}
</fieldset>

<style>
    fieldset {
        border: none;
    }

    input {
        width: 20rem;
        height: 2rem;

        border-radius: 0;
        border-width: 0.1rem;
        border-color: var(--pitch-black);
    }

    input:focus {
        border-radius: 0;
    }
</style>