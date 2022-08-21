<script lang="ts">
	export let width = 24;
	export let height = 24;
</script>

<div class="alert">
	<svg style="width:{width}px;height:{height}px" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm-1-7a1 1 0 1 1 1-1a1 1 0 0 1-1 1z"
		/>
	</svg>
</div>

<style>
    .alert {
        color: var(--alert-indicator-color);
    }
</style>