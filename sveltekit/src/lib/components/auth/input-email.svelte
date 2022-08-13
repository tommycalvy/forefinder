<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';
    import FormTextInput from "./form-text-input.svelte";

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;
    export let value: string;

</script>

<fieldset>
    <FormTextInput 
        id="email"
        type="email"
        name={attributes.name}
        required={attributes.required}
        bind:value
        label="Email Address"
        disabled={attributes.disabled}
    />
  
    {#if messages}
        {#each messages as message}
            <div class="typography-caption">
                { message }
            </div>
        {/each}
    {/if}
</fieldset>

<style>
    fieldset {
        border: none;
        padding: 0;
        margin: 0;
    }
</style>
    


