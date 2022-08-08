<script lang="ts">
    export let type: string;
    export let name: string;
    export let required: boolean | null | undefined;
    export let value: string;

    export let label: string;
</script>


<label>
    <input
        {type}
        {name}
        {required}
        {value}
        placeholder=" "
    />
    <span class="input-label">{label}</span>
    <legend>
        <span class="border-blocker">{label}</span>
    </legend>
</label>



<style>

    input {
        width: 20rem;
        height: 3rem;
        font-size: 1rem; 
        padding: 0rem 1rem;
        outline-style: solid;
        outline-width: 0.08rem;
        outline-color: var(--shadow-color);
        border-width: 0.08rem;
        border-color: var(--pure-white);
        border-radius: 0rem;
        border-style: solid;
    }

    input:focus {
        
        border-color: var(--pine-tree-green);
        outline-color: var(--pine-tree-green);
    }

    input:focus:hover {
        border-color: var(--pine-tree-green);
        outline-color: var(--pine-tree-green);
    }

    input:hover {
        outline-color: var(--pitch-black);
    }

    .input-label {
        font-family: Inter, sans-serif;
        font-weight: 200;
        position: absolute;
        color: var(--shadow-color);
        margin-top: 1rem;
        margin-left: -21.1rem;
        pointer-events: none;
        z-index: 1;
        white-space: nowrap;
        transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }

    input:focus ~ .input-label {
        color: var(--pine-tree-green);
    }

    input:focus ~ .input-label, input:not(:placeholder-shown) ~ .input-label {
        transform: translate(-0.8rem, -1.6rem) scale(0.75);
        font-weight: 400;
    }

    input:focus ~ legend .border-blocker, input:not(:placeholder-shown) ~ legend .border-blocker {
        visibility: visible;
    }

    .border-blocker {
        position: absolute;
        margin-top: -4.15rem;
        visibility: hidden;
        color: var(--pure-white);

        margin-left: 1rem;
        text-align: center;
        
        font-size: 0.75rem;
        padding: 0 0.3rem;
        border-bottom: 0.2rem solid red;
    }
</style>
