<script lang="ts">
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';
	import { Svg } from '@smui/common/elements';
	import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
	import { mdiMenu } from '@mdi/js';
	import { mdiAccountCircleOutline } from '@mdi/js';
	import { mdiHelpCircleOutline } from '@mdi/js';
	import { mdiMagnify } from '@mdi/js';
	import { mdiArrowRight } from '@mdi/js';

	import Drawer, { AppContent, Content, Header, Subtitle } from '@smui/drawer';

	import List, { Item, Text } from '@smui/list';

	import { onMount } from 'svelte';

	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import Fab from '@smui/fab';

	let topAppBar: TopAppBarComponentDev;

	let open = false;
	let active = 'Discover';

	function setActive(value: string) {
		active = value;
	}

	let darkTheme: boolean | undefined = undefined;

	onMount(() => {
		const prefers = window.matchMedia('(prefers-color-scheme: dark)');
		darkTheme = typeof prefers === 'boolean' ? prefers : false;
	});

	let value = '';

	function doSearch() {
		alert('Search for ' + value);
	}

	function handleKeyDown(event: CustomEvent | KeyboardEvent) {
		event = event as KeyboardEvent;
		if (event.key === 'Enter') {
			doSearch();
		}
	}
</script>

<svelte:head>
	<!-- SMUI Styles -->
	{#if darkTheme === undefined}
		<link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
		<link rel="stylesheet" href="/smui-dark.css" media="screen and (prefers-color-scheme: dark)" />
	{:else if darkTheme}
		<link rel="stylesheet" href="/smui.css" />
		<link rel="stylesheet" href="/smui-dark.css" media="screen" />
	{:else}
		<link rel="stylesheet" href="/smui.css" />
	{/if}
</svelte:head>

<TopAppBar bind:this={topAppBar} variant="fixed">
	<Row>
		<Section>
			<IconButton
				class="material-icons"
				on:click={() => (open = !open)}
				size="normal"
				title="Main menu"
			>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiMenu} />
				</Icon>
			</IconButton>
			<Title>forefinder</Title>
		</Section>
		<Section>
			<div class="solo-container">
				<Paper class="solo-paper" elevation={2}>
					<Icon class="solo-icon" component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiMagnify} />
					</Icon>
					<Input bind:value on:keydown={handleKeyDown} placeholder="Search golfers" class="solo-input" />
				</Paper>
				<Fab on:click={doSearch} disabled={value === ''} color="secondary" mini class="solo-fab">
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiArrowRight} />
					</Icon>
				</Fab>
			</div>
		</Section>
		
		<Section align="end" toolbar>
			<IconButton>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiHelpCircleOutline} />
				</Icon>
			</IconButton>
			<IconButton>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiAccountCircleOutline} />
				</Icon>
			</IconButton>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
	<Drawer variant="dismissible" bind:open>
		<Header>
			<Title>Super Drawer</Title>
			<Subtitle>It's the best drawer.</Subtitle>
		</Header>
		<Content>
			<List>
				<Item
					href="/discover"
					on:click={() => setActive('Discover')}
					activated={active === 'Discover'}
					title="Discover"
				>
					<Text>Discover</Text>
				</Item>
				<Item
					href="/friends"
					on:click={() => setActive('Friends')}
					activated={active === 'Friends'}
					title="Friends"
				>
					<Text>Friends</Text>
				</Item>
				<Item
					href="/profile"
					on:click={() => setActive('Profile')}
					activated={active === 'Profile'}
					title="Profile"
				>
					<Text>Profile</Text>
				</Item>
				<Item
					href="/messages"
					on:click={() => setActive('Messages')}
					activated={active === 'Messages'}
					title="Messages"
				>
					<Text>Messages</Text>
				</Item>
				<IconButton
					aria-label="Toggle Dark or Light Mode"
					on:click={() => (darkTheme = !darkTheme)}
					title={darkTheme ? 'Lights On' : 'Lights Off'}
				>
					<Icon component={Svg} viewBox="0 0 24 24">
						<path fill="currentColor" d={darkTheme ? mdiWeatherSunny : mdiWeatherNight} />
					</Icon>
				</IconButton>
			</List>
		</Content>
	</Drawer>
	<AppContent>
		<main>
			<slot />
		</main>
	</AppContent>
</AutoAdjust>

<style>
	.solo-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	* :global(.solo-paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 0 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.solo-paper > *) {
		display: inline-block;
		margin: 0 12px;
	}
	* :global(.solo-icon) {
		width: 28px;
		height: 28px;
	}
	* :global(.solo-input) {
		flex-grow: 1;
		color: var(--mdc-theme-on-surface, #000);
	}
	* :global(.solo-input::placeholder) {
		color: var(--mdc-theme-on-surface, #000);
		opacity: 0.6;
	}
	* :global(.solo-fab) {
		flex-shrink: 0;
	}
</style>
