<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	let birthmonth = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	let birthday = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 30, 31
	];
	let birthyear = [
		2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006,
		2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997
	];
</script>

<section>
	<div class="title">
		<h1>Users</h1>
	</div>

	<div class="create-user">
		<h2>Create User Form</h2>
		<br />
		<form method="POST" action="?/createuser" use:enhance>
			<div class="create-user-field">
				<lable for="email" name="email">Email</lable>
				<input type="email" placeholder="johndoe@hotmail.com" id="email" name="email" required />
			</div>
			<div class="create-user-field">
				<lable for="username" name="username">Username</lable>
				<input placeholder="John-Doe1234" id="username" name="username" required />
			</div>
			<div class="create-user-field">
				<lable for="fullname" name="fullname">Full Name</lable>
				<input placeholder="John Doe" id="fullname" name="fullname" required />
			</div>

			<div class="create-user-field">
				<lable>Date of Birth</lable>
				<select name="birthmonth" id="birthmonth" required>
					{#each birthmonth as month, i}
						<option value={i + 1}>{month}</option>
					{/each}
				</select>
				<select name="birthday" id="birthday" required>
					{#each birthday as day}
						<option value={day}>{day}</option>
					{/each}
				</select>
				<select name="birthyear" id="birthyear" required>
					{#each birthyear as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</div>

			<div class="radio-field">
				<label for="gender" name="gender">Gender</label>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="1" required />
					<label for="gender">Male</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="2" required />
					<label for="gender">Female</label>
				</div>
				<div class="radio-option">
					<input type="radio" id="gender" name="gender" value="3" required />
					<label for="gender">Other</label>
				</div>
			</div>
			<br />
			<div class="create-user-submit">
				<button type="submit">Create User</button>
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
		<h2>Search Users</h2>
		<br />
		<div class="search-bar">
			<form method="POST" action="?/GetUserByUsername" use:enhance>
				<div class="search-input">
					<input placeholder="John-Doe1234" name="username" />
				</div>
				<div class="search-button">
					<button type="submit">Search Username</button>
				</div>
			</form>
		</div>
		<div class="search-bar">
			<form method="POST" action="?/GetUserByEmail" use:enhance>
				<div class="search-input">
					<input placeholder="johndoe@hotmail.com" name="email" />
				</div>
				<div class="search-button">
					<button type="submit">Search Email</button>
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
