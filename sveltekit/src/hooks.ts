import type { GetSession, Handle } from '@sveltejs/kit';
import { auth } from '$lib/auth';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const cookies = event.request.headers.get('cookie') ?? undefined;
		const { status, data } = await auth.toSession(undefined, cookies, {
			withCredentials: true
		});
		if (status === 401) {
			event.locals.session = undefined;
			return await resolve(event);
		}
		event.locals.session = data;

		const response = await resolve(event);

		return {
			...response,
			headers: {
				...response.headers
			}
		};
	} catch (error) {
		return await resolve(event);
	}
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = (event) => {
	return {
		user: event.locals.session && {
			id: event.locals.session.identity.id,
			email: event.locals.session?.identity?.traits?.email,
			verified: event.locals.session?.identity?.verifiable_addresses?.[0]?.verified ?? false
		}
	};
}
