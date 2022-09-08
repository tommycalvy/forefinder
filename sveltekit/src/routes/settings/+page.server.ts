import type { PageServerLoad, Action } from './$types';
import { auth, modifyAction } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type { UiContainer, SubmitSelfServiceSettingsFlowBody } from '@ory/kratos-client';
import type { AxiosError } from 'axios';

export const load: PageServerLoad = async ({
	url,
	setHeaders,
	request,
	parent
}): Promise<{ ui: UiContainer; title: string }> => {
	const { user } = await parent();
	if (!user) {
		console.log('No user session. Redirecting to /login');
		throw redirect(307, '/login');
	}

	const flowId = url.searchParams.get('flow') ?? undefined;
	const returnTo = url.searchParams.get('returnTo') ?? undefined;

	if (!flowId) {
		return await auth
			.initializeSelfServiceSettingsFlowForBrowsers(returnTo, {
				headers: {
					cookie: request.headers.get('cookie')
				}
			})
			.then(
				({ data: { ui }, headers }) => {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = modifyAction('/settings', ui.action);
					return {
						ui,
						title: 'Forefinder Settings'
					};
				},
				(err: AxiosError) => {
					if (err.response?.status === 401) {
						console.log(err.response.data);
					} else {
						console.log(err);
					}
					throw error(500, 'Error with settings page load');
				}
			);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.getSelfServiceSettingsFlow(flowId, undefined, cookie).then(
		({ data: { ui } }) => {
			ui.action = modifyAction('/settings', ui.action);
			return {
				ui,
				title: 'Forefinder Settings'
			};
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with settings page load');
		}
	);
};

export const POST: Action = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow') ?? undefined;
	if (typeof flowId !== 'string') {
		const err = new Error('No flow id');
		console.log(err);
		throw error(400, 'No flow id');
	}

	const values = await request.formData();
	const authMethod = values.get('auth_method') ?? undefined;
	if (typeof authMethod !== 'string') {
		const err = new Error('No method attribute in post body');
		console.log(err);
		throw error(400, 'No method attribute in post body');
	}

	let flowBody: SubmitSelfServiceSettingsFlowBody;

	if (authMethod === 'oidc') {
		const link = values.get('link') ?? undefined;
		const unlink = values.get('unlink') ?? undefined;
		if (typeof link === 'string') {
			if (typeof unlink === 'string') {
				flowBody = {
					flow: flowId,
					link,
					method: authMethod,
					unlink,
					traits: {
						email: values.get('traits.email') ?? undefined,
						name: {
							first: values.get('traits.name.first') ?? undefined
						},
						color: values.get('traits.color') ?? undefined
					}
				};
			} else {
				flowBody = {
					flow: flowId,
					link,
					method: authMethod,
					traits: {
						email: values.get('traits.email') ?? undefined,
						name: {
							first: values.get('traits.name.first') ?? undefined
						},
						color: values.get('traits.color') ?? undefined
					}
				};
			}
		} else {
			throw error(400, 'Incorrect form data');
		}
	} else if (authMethod === 'password') {
		const password = values.get('password') ?? undefined;
		const csrf_token = values.get('csrf_token') ?? undefined;
		if (typeof password === 'string' && typeof csrf_token === 'string') {
			flowBody = {
				csrf_token,
				password,
				method: authMethod
			};
		} else {
			throw error(400, 'Incorrect form data');
		}
	} else if (authMethod === 'profile') {
		const csrf_token = values.get('csrf_token') ?? undefined;
		if (typeof csrf_token === 'string') {
			flowBody = {
				csrf_token,
				method: authMethod,
				traits: {
					email: values.get('traits.email') ?? undefined,
					name: {
						first: values.get('traits.name.first') ?? undefined
					},
					color: values.get('traits.color') ?? undefined
				}
			};
		} else {
			throw error(400, 'Incorrect form data');
		}
	} else {
		const err = new Error('Settings method not supported');
		console.log(err);
		throw error(400, 'Settings method not supported');
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.submitSelfServiceSettingsFlow(flowId, flowBody, undefined, cookie).then(
		({ headers }) => {
			if (headers['location']) {
				throw redirect(302, headers['location']);
			} else {
				throw redirect(302, `/settings?flow=${flowId}`);
			}
		},
		(err: AxiosError) => {
			if (err.response) {
				if (err.response.status === 400) {
					throw redirect(303, `/settings?flow=${flowId}`);
				} else if (err.response.status === 401) {
					console.log(err.response.data);
					throw redirect(303, '/settings');
				} else if (err.response.status === 403) {
					console.log(err.response.data);
					if (err.response?.data.redirect_browser_to) {
						throw redirect(303, `/login?refresh=true&returnTo=/settings?flow=${flowId}`);
					} else {
						throw redirect(303, '/settings');
					}
				} else if (err.response.status === 500) {
					console.log(err.response.data);
				}
			}
			console.log(err);
			throw error(500, 'Settings post submit error');
		}
	);
};
