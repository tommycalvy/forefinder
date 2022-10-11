<section>
	<div class="title">
		<h1>Users</h1>
	</div>

	<div class="create-user">
		<h2>Create User Form</h2>
		<br />
		<form>
			<div class="create-user-field">
				<lable for="userid">UserID</lable>
				<input placeholder="John-Doe#1234" id="userid" name="userid" />
			</div>
			<div class="create-user-field">
				<lable for="fullname">Full Name</lable>
				<input placeholder="John Doe" id="fullname" name="fullname" />
			</div>
			<div class="create-user-field">
				<lable for="dateofbirth">Date of Birth</lable>
				<input type="date" id="dateofbirth" name="dateofbirth" />
			</div>
			<div class="radio-field">
				<label for="gender">Gender</label>
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
            <br>
            <div class="create-user-submit">
                <button type="submit">Create User</button>
            </div>
		</form>
	</div>

    <div class="search-users">
        <h2>Search Users</h2>
        <br />
        <div class="search-bar">
            <form>
                <input placeholder="John-Doe#1234" name="userid"/>
                <button type="submit">Search userID</button>
            </form>
        </div>
        <div class="search-results">
            <p>Results...</p>
        </div>
    </div>
</section>

<style>
	section {
		display: grid;
        grid-template-rows: 10rem auto;
		grid-template-columns: 40rem auto;
        grid-template-areas: 
        "title title"
        "create search";
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
        padding: 1rem 0;
    }

    .search-bar form {
        display: flex;
        justify-content: center;
        gap: 1rem;

    }
</style>
