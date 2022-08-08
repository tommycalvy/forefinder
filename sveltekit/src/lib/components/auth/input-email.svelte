<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';
    import FormTextInput from "./form-text-input.svelte";

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;

</script>


<fieldset>
    <div>
        <FormTextInput 
            type="email"
            name={attributes.name}
            required={attributes.required}
            value=""
            label="Email Address"
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
    }

</style>