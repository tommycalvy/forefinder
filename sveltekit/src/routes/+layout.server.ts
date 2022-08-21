import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth';
import axios from 'axios';
import type { User } from '$lib/auth';

export const load: LayoutServerLoad = async ({ request }): Promise<{ user: User | undefined }> => {
	try {
		let cookies = request.headers.get('cookies') ?? undefined;
		if (cookies) {
			cookies = decodeURIComponent(cookies);
		}
		const { data } = await auth.toSession(undefined, cookies);
		return {
			user: {
				id: data.identity.id,
				email: data.identity.traits.email,
				name: data.identity.traits.name.first,
				verified: data.identity.verifiable_addresses?.[0].verified ?? false
			}
		};
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.log('axios error');
			console.log(err);
		} else {
			console.log(err);
		}
		return {
			user: undefined
		};
	}
};
