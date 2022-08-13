<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';
    import FormTextInput from "./form-text-input.svelte";

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;
    export let value: string;
</script>


<fieldset>
    <div>
        <FormTextInput 
            id="password"
            type="password"
            name={attributes.name}
            required={attributes.required}
            label="Password"
            disabled={attributes.disabled}
            bind:value
        />
    </div>
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