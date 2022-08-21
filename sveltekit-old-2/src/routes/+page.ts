import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async ({ session, url, fetch }) => {
	if (session.user) {
		const res = await fetch('/auth/logout');
		if (res.ok) {
			const { logout_token } = await res.json();
			return {
				logoutToken: logout_token
			};
		}
	}
	return {
		user: session.user,
		logoutToken: undefined
	};
};
