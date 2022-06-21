<script>
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		SkipToContent,
		Content,
		Theme
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';

	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import Chat from 'carbon-icons-svelte/lib/Chat.svelte';
	import LocationCurrent from 'carbon-icons-svelte/lib/LocationCurrent.svelte';
	import UserProfile from 'carbon-icons-svelte/lib/UserProfile.svelte';
	import Friendship from 'carbon-icons-svelte/lib/Friendship.svelte';

	import { page } from '$app/stores';

	let isSideNavOpen = true;
	let isOpen1 = false;
</script>

<Header
	persistentHamburgerMenu={true}
	platformName="Golfers"
	company="forefinder"
	bind:isSideNavOpen
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 2</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 3</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 4</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink icon={LocationCurrent} href="/discover" text="Discover" />
		<SideNavLink icon={Friendship} href="/friends" text="Friends" />
		<SideNavLink icon={Chat} href="/messages" text="Messages" />
		<SideNavLink icon={UserProfile} href="/profile" text="Profile" />
		<Theme
			render="toggle"
			toggle={{
				themes: ['g10', 'g90'],
				labelA: 'Enable dark mode',
				labelB: 'Enable dark mode',
				hideLabel: true,
				size: 'sm'
			}}
		/>
	</SideNavItems>
</SideNav>

<Content>
	<slot />
</Content>
