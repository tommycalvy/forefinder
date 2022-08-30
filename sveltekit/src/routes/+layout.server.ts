import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth';
import axios from 'axios';
import type { User } from '$lib/auth';

export const load: LayoutServerLoad = async ({
	request
}): Promise<
	{ user: undefined; logout_token: undefined } | { user: User; logout_token: string }
> => {
	try {
		let cookie = request.headers.get('cookie') ?? undefined;
		if (cookie) {
			cookie = decodeURIComponent(cookie);
		} else {
			return {
				user: undefined,
				logout_token: undefined
			};
		}
		/*
		const {
			data: { identity }
		} = await auth.toSession(undefined, cookie);
		
		const {
			data: { logout_token }
		} = await auth.createSelfServiceLogoutFlowUrlForBrowsers(cookie);
		return {
			user: {
				id: identity.id,
				email: identity.traits.email,
				name: identity.traits.name.first,
				verified: identity.verifiable_addresses?.[0].verified ?? false,
				color: identity.traits.color
			},
			logout_token
		};
		*/
		const { data } = await auth.toSession(undefined, cookie);
		console.log(data);
		const {
			data: { logout_token }
		} = await auth.createSelfServiceLogoutFlowUrlForBrowsers(cookie);
		console.log('token: ', logout_token);
		return {
			user: {
				id: data.identity.id,
				email: data.identity.traits.email,
				name: data.identity.traits.name.first,
				verified: data.identity.verifiable_addresses?.[0].verified ?? false,
				color: data.identity.traits.color
			},
			logout_token
		};

	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.response?.status === 401) {
				console.log('Unauthorized. No session. In +layout.server.ts');
			} else {
				console.log('axios error');
				console.log(err);
			}
		} else {
			console.log(err);
		}
		return {
			user: undefined,
			logout_token: undefined
		};
	}
};
