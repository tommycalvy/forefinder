<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';
    import FormTextInput from "./form-text-input.svelte";
    import Messages from "./messages.svelte";

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;
    export let value: string;
    export let label: string;

</script>

<fieldset>
    <FormTextInput 
        id="text"
        type="text"
        name={attributes.name}
        required={attributes.required}
        bind:value
        {label}
        disabled={attributes.disabled}
    />
  
    {#if messages}
        <Messages {messages} />
    {/if}
</fieldset>

<style>
    fieldset {
        border: none;
        padding: 0;
        margin: 0;
    }
</style>
    
