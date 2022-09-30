<script lang="ts">
    import type { PageServerData } from "./$types";
    export let data: PageServerData;

</script>



<section>
	<h1>forefinder <br /> Hello World</h1>
	<br />
	<br />

	{#if data.user}
		<h1>Hello {data.user.name}!</h1>
	{:else}
		<a href="/login"><button>Log In</button></a>
		<p>or</p>
		<a href="/registration"><button>Sign Up</button></a>
	{/if}
	<br>
	<br>
	<br>
	<div class="crud-service">
		<form class="create-profile" method="POST" action="/profile/create" enctype="application/x-www-form-urlencoded">
			<input placeholder="ID" name="id"/>
			<input type="hidden" name="pType" value="golf" />
			<input placeholder="Profile Type" name="pType" />
			<input placeholder="Name" name="name" />
			<input placeholder="Status" name="status" />
			<input type="number" placeholder="Average Score" name="avgScore" />
			<input type="number" placeholder="Age" name="age" />
			<p>What is your gender?</p>
			<div class="radio-field">
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="0"/>
					<label for="gender">Male</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="1"/>
					<label for="gender">Female</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="2"/>
					<label for="gender">Other</label>
				</div>	
			</div>
			<br>
			<input placeholder="Bio" name="bio" />
			<p>How do you like to play golf?</p>
			<div class="radio-field">
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="0"/>
					<label for="gender">Social</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="1"/>
					<label for="gender">Network</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="2"/>
					<label for="gender">Laid back</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="playStyle" value="3"/>
					<label for="gender">Competitive</label>
				</div>	
			</div>
			<input type="color"/>
			<br>
			<button>Create Profile</button>
		</form>
	</div>
	
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
        text-align: center;
	}

	h1 {
		width: 100%;
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
	/*
	.user-circle {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}


	.user-circle span {
		text-align: center;
		color: var(--pure-white);
		font-size: large;
	}
	*/
</style>