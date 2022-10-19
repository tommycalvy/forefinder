<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	
</script>


<section>
	<div class="title">
		<h1>Users</h1>
	</div>

	<div class="create-user">
		<h2>Create Post</h2>
		<br />
		<form method="POST" action="?/createpost" use:enhance>
			<div class="create-user-field">
				<lable for="title" name="title">Title</lable>
				<input placeholder="Who wants to play golf today?" id="title" name="title" required />
			</div>
			<div class="create-user-field">
				<lable for="fullname" name="fullname">Content</lable>
				<input type="text" placeholder="John Doe" id="content" name="content" required />
			</div>
			<br />
			<div class="create-user-submit">
				<button type="submit">Post</button>
			</div>
		</form>
		{#if form?.action === 'createuser'}
            {#if form.success}
                <p>User Created Successfully</p>
            {:else}
                <p>Err: {form.err}</p>
            {/if}
        {/if}
	</div>

	<div class="search-users">
		<h2>Search Posts</h2>
		<br />
		<div class="search-bar">
			<form method="POST" action="?/GetPostsByUsername" use:enhance>
				<div class="search-input">
					<input placeholder="John-Doe1234" name="username" />
				</div>
				<div class="search-button">
					<button type="submit">Search Posts By ID</button>
				</div>
			</form>
		</div>
		<div class="search-bar">
			<form method="POST" action="?/GetPostsByGeo" use:enhance>
				<div class="search-input">
                    <input placeholder="Latitude" name="latitude" />
					<input placeholder="Longitude" name="longitude" />
				</div>
				<div class="search-button">
					<button type="submit">Search Posts By Geo</button>
				</div>
			</form>
		</div>
		<div class="search-results">
			{#if form?.user}
				<p>Username: {form.user.Username}</p>
                <p>Email: {form.user.Email}</p>
                <p>Fullname: {form.user.Fullname}</p>
                <p>Dateofbirth: {form.user.Dateofbirth}</p>
                <p>Gender: {form.user.Gender}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		display: grid;
		grid-template-rows: 10rem auto;
		grid-template-columns: 40rem auto;
		grid-template-areas:
			'title title'
			'create search';
		background-color: var(--background-community-main-light);
		gap: 0.1rem;
	}
	.title {
		display: flex;
		justify-content: center;
		align-items: center;
		grid-area: title;
		background-color: white;
	}
	.create-user {
		grid-area: create;
		padding: 1rem 2rem;
		background-color: white;
	}

	.create-user h2 {
		text-align: center;
	}

	.create-user-submit {
		display: flex;
		justify-content: center;
	}

	.create-user-field {
		margin: 1rem 0;
	}

	.create-user-field lable {
		display: inline-flex;
		width: 11rem;
	}

	.radio-field {
		display: flex;
		justify-content: first;
	}

	.radio-field > label {
		width: 11rem;
	}

	.radio-option {
		display: inline-flex;
		margin-right: 1rem;
	}

	.search-users {
		background-color: white;
		padding: 1rem 2rem;
	}

	.search-users h2 {
		text-align: center;
	}

	.search-bar {
		margin: 1rem 0;
	}

	.search-bar form {
		display: grid;
		grid-template-columns: 50% 50%;
		gap: 1rem;
	}

	.search-input {
		display: flex;
		justify-content: right;
	}

	.search-button {
		display: flex;
		justify-content: left;
	}
</style>