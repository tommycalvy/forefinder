<script lang="ts">
    import type { UiNodeInputAttributes, UiText } from '@ory/kratos-client';

    export let attributes: UiNodeInputAttributes;
    export let messages: Array<UiText> | undefined;

</script>


<fieldset class="text-input-fieldset">
    <div class="text-input-inner">
        <label>
            <input
                class="text-input"
                type="text"
                name={attributes.name}
                required={attributes.required}
                value={attributes.value}
                placeholder={attributes.label?.text}
            />
        </label>
    </div>
    {#if messages}
        {#each messages as message}
            <div class="typography-caption">
                { message }
            </div>
        {/each}
    {/if}
</fieldset>