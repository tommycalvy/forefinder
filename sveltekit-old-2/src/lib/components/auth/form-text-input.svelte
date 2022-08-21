<script lang="ts">
	export let type: string;
	export let name: string;
	export let required: boolean | null | undefined = undefined;
	export let value: string = '';
	export let disabled: boolean | null | undefined = undefined;
	export let label: string;
	export let id: string;
</script>


<!-- svelte-ignore a11y-label-has-associated-control -->
<label htmlfor={id}>
	{#if type === 'email'}
		<input {id} type="email" {name} {required} {disabled} placeholder=" " bind:value/>
	{:else if type === 'password'}
		<input {id} type="password" {name} {required} {disabled} placeholder=" " bind:value/>
	{:else}
		<input {id} type="text" {name} {required} {disabled} placeholder=" " bind:value/>
	{/if}
	<span class="input-label">{label}</span>
	<fieldset>
		<legend>{label}</legend>
	</fieldset>
</label>

<style>
	input {
		width: 20rem;
		height: 3rem;
		font-size: 1rem;
		padding: 0rem 1rem;
		border: none;
		outline: none;
	}

	input:focus ~ fieldset,
	input:focus:hover ~ fieldset {
		border-color: var(--pine-tree-green);
		border-width: 0.16rem;
		width: 21.68rem;
		height: 3.14rem;
		margin: -3.4rem 0 0 0;
	}

	input:hover ~ fieldset {
		border-color: var(--pitch-black);
	}

	input:not(:placeholder-shown) ~ fieldset {
		width: 21.84rem;
		height: 3.29rem;
		margin: -3.39rem 0 0 0;
	}

	input:not(:placeholder-shown):focus ~ fieldset,
	input:not(:placeholder-shown):focus:hover ~ fieldset {
		width: 21.68rem;
		height: 3.14rem;
		margin: -3.4rem 0 0 0;
	}

	.input-label {
		position: absolute;
		color: var(--input-label-color);

		/*
		margin-left: -21.1rem;
        TODO: try transform-origin in the ory login page
        */
		display: block;
		transform-origin: left top;
		margin-top: -2rem;
		margin-left: 1rem;

		pointer-events: none;
		z-index: 1;
		white-space: nowrap;
		transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
			transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
	}

	input:focus ~ .input-label {
		color: var(--pine-tree-green);
	}

	input:focus ~ .input-label,
	input:not(:placeholder-shown) ~ .input-label {
		transform: translateY(-1.45rem) scale(0.75);
		font-weight: 400;
	}

	input:not(:placeholder-shown) ~ .input-label {
		transition: none;
	}

	input:not(:placeholder-shown):hover ~ .input-label {
		transition: none;
		color: var(--pitch-black);
	}

	input:not(:placeholder-shown):focus ~ .input-label {
		transition: none;
		color: var(--pine-tree-green);
	}

	input:focus ~ fieldset > legend,
	input:not(:placeholder-shown) ~ fieldset > legend {
		float: none;
	}

	fieldset {
		position: absolute;

		width: 21.84rem;
		height: 2.95rem;
		margin: -3.05rem 0 0 0;

		padding: 0;
		pointer-events: none;

		border-width: 0.08rem;
		border-color: var(--shadow-color);
		border-radius: 0rem;
		border-style: solid;
	}

	legend {
		display: block;
		visibility: hidden;
		font-size: 0.75rem;
		pointer-events: none;
		margin: 0 0.64rem;
		float: left;
		padding: 0 0.2rem;
	}
</style>
