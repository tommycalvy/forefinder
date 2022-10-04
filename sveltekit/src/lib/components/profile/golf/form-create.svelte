<script lang="ts">
	import { enhance } from '$app/forms';
	export let success: boolean | undefined;
</script>

<section>
	<h1>Create Profile</h1>
	{#if success}
		<p>Successfully created profile!</p>
	{/if}
	<div class="crud-service">
		<form
			class="create-profile"
			method="POST"
			action="?/create"
			enctype="application/x-www-form-urlencoded"
			use:enhance
		>
			<input placeholder="ID" name="id" />
			<input type="hidden" name="pType" value="golf" />
			<input placeholder="Profile Type" name="pType" />
			<input placeholder="Name" name="name" />
			<input placeholder="Status" name="status" />
			<input type="number" placeholder="Average Score" name="avgScore" />
			<input type="number" placeholder="Age" name="age" />
			<p>What is your gender?</p>
			<div class="radio-field">
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="1" />
					<label for="gender">Male</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="2" />
					<label for="gender">Female</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="3" />
					<label for="gender">Other</label>
				</div>
			</div>
			<br />
			<input placeholder="Bio" name="bio" />
			<p>How do you like to play golf?</p>
			<div class="radio-field">
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="social" />
					<label for="gender">Social</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="network" />
					<label for="gender">Network</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="laid-back" />
					<label for="gender">Laid back</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="competitive" />
					<label for="gender">Competitive</label>
				</div>
			</div>
			<input type="color" />
			<br />
			<button>Create Profile</button>
		</form>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	.crud-service {
		display: flex;
		justify-content: space-around;
	}

	.create-profile {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.radio-field {
		display: flex;
		justify-content: center;
		column-gap: 1rem;
	}

	.radio-option {
		display: flex;
		flex-direction: column;
	}
</style>
