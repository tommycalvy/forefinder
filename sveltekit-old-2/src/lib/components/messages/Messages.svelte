<script lang="ts">
	import UserFilled from '$lib/components/icons/user-filled.svelte';

	const fakeMessages = [
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		},
		{
			name: 'Tommy',
			picture: UserFilled,
			text: 'I can play at 8am on saturday'
		}
	];
</script>

<div class="message-list">
	{#each fakeMessages as message}
		<div class="message">
			<div class="pic">
				<svelte:component this={message.picture} width={72} height={72} />
			</div>
			<div class="text">
				<h3>{message.name}</h3>
				<p>{message.text}</p>
			</div>
		</div>
		<hr />
	{/each}
</div>

<style>
	.message-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* border-right: 0.2rem solid var(--shadow-color); */

		overflow-x: hidden;
		overflow-y: auto;
	}

	.message {
		display: flex;
		justify-content: left;
		gap: 1rem;
		align-items: center;
	}

	.text {
		display: flex;
		flex-direction: column;
		align-items: left;
		gap: 1rem;
	}

	.text p,
	h3 {
		margin: 0;
	}

	hr {
		width: 80%;
		border: 1px solid var(--hr-line-color);
	}
</style>
