import type { PageServerLoad, Action } from './$types';
import { auth, modifyAction } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type { UiContainer, SubmitSelfServiceSettingsFlowBody } from '@ory/kratos-client';
import type { AxiosError } from 'axios';
import config from '$lib/config';

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
		return await auth.initializeSelfServiceSettingsFlowForBrowsers(returnTo, {
            headers: {
				'cookie': request.headers.get('cookie')
			}
        }).then(
			({ data: { ui }, headers }) => {
				const action = modifyAction('/settings', ui.action);
				if (action) {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = action;
					return {
						ui,
						title: 'Forefinder Settings'
					};
				}
				console.log('Err: No action in UiContainer in settings load');
				throw error(500, 'Error with settings page load');
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
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}

	return await auth.getSelfServiceSettingsFlow(flowId, undefined, cookie).then(
		({ data: { ui } }) => {
			const action = modifyAction('/settings', ui.action);
			if (action) {
				ui.action = action;
				return {
					ui,
					title: 'Forefinder Settings'
				};
			}
			console.log('Err: No action in UiContainer in settings load');
			throw error(500, 'Error with settings page load');
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with settings page load');
		}
	);
};

export const POST: Action = async ({ request, url }) => {
	console.log('Settings POST began');
	const flowId = url.searchParams.get('flow') ?? undefined;

	if (!flowId) {
		throw redirect(303, '/settings');
	}

	const values = await request.formData();

	const authMethod = values.get('auth_method') ?? undefined;

	if (typeof authMethod !== 'string') {
		const err = new Error('No method attribute in post body');
		console.log(err);
		throw redirect(303, '/settings');
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
						}
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
						}
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
					}
				}
			};
		} else {
			throw error(400, 'Incorrect form data');
		}
	} else {
		const err = new Error('Verification method not supported');
		console.log(err);
		throw redirect(303, '/settings');
	}

    let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}

	return await auth.submitSelfServiceSettingsFlow(flowId, flowBody, undefined, cookie).then(
		({ data }) => {
			console.log(data);
			const action = modifyAction('/settings', data.ui.action);
			if (action) {
				data.ui.action = action;
				return {
					errors: {
						ui: data.ui
					},
					status: 200
				};
			} else {
				console.log('AxiosError: No action in UiContainer in settings post');
				throw redirect(303, '/settings');
			}
		},
		(err: AxiosError) => {
			if (err.response) {
				if (err.response.status === 400) {
					console.log(err.response.data);
					const action = modifyAction('/settings', err.response.data.ui.action);
					if (action) {
						err.response.data.ui.action = action;
						return {
							errors: {
								ui: err.response.data.ui
							},
							status: 400
						};
					} else {
						console.log('AxiosError: No action in UiContainer in settings post');
						throw redirect(303, '/settings');
					}
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
					throw redirect(303, '/settings');
				}
			}
			console.log(err);
			throw redirect(303, '/settings');
		}
	);
};
