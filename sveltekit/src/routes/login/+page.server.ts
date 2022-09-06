import type { PageServerLoad, Action } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { auth, modifyAction } from '$lib/auth';
import type {
	UiContainer,
	SubmitSelfServiceLoginFlowWithOidcMethodBody,
	SubmitSelfServiceLoginFlowWithPasswordMethodBody
} from '@ory/kratos-client';
import { isSelfServiceLoginFlow } from '$lib/auth';
import axios from 'axios';
import type { AxiosError } from 'axios';


export const load: PageServerLoad = async ({
	parent,
	url,
	request,
	setHeaders
}): Promise<{ ui: UiContainer; title: string }> => {
	const flowId = url.searchParams.get('flow') ?? undefined;
	const refresh = url.searchParams.get('refresh') === 'true' ? true : false;
	const aal = url.searchParams.get('aal') ?? undefined;
	const returnTo = url.searchParams.get('returnTo') ?? undefined;

	if (refresh) {
		return await auth.initializeSelfServiceLoginFlowForBrowsers(refresh, aal, returnTo).then(
			({ data: { ui }, headers }) => {
				const action = modifyAction('/login', ui.action);
				if (action) {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = action;
					return {
						ui,
						title: 'Forefinder Login'
					};
				}
				console.log('Err: No action in UiContainer in login load');
				throw error(500, 'Error with login page load');
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with login page load');
			}
		);
	}

	const { user } = await parent();
	if (user) {
		console.log('User detected. Redirecting to /');
		throw redirect(307, '/');
	}

	if (!flowId) {
		console.log('no flowId');
		return await auth.initializeSelfServiceLoginFlowForBrowsers(refresh, aal, returnTo).then(
			({ data: { ui }, headers }) => {
				const action = modifyAction('/login', ui.action);
				if (action) {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = action;
					console.log('About to return ui');
					return {
						ui,
						title: 'Forefinder Login'
					};
				}
				console.log('Err: No action in UiContainer in login load');
				throw error(500, 'Error with login page load');
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with login page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}
	return await auth.getSelfServiceLoginFlow(flowId, cookie).then(
		({ data: { ui } }) => {
			const action = modifyAction('/login', ui.action);
			if (action) {
				ui.action = action;
				console.log('About to return getLogin ui');
				return {
					ui,
					title: 'Forefinder Login'
				};
			}
			console.log('Err: No action in UiContainer in login load');
			throw error(500, 'Error with login page load');
		},
		(err: AxiosError) => {
			if (err.response?.status === 400) {
				const action = modifyAction('/login', err.response.data.ui.action);
				if (action) {
					err.response.data.ui.action = action;
					console.log('About to return getLogin error ui');
					return {
						ui: err.response.data.ui,
						title: 'Forefinder Login'
					};
				}
				console.log('AxiosError: No action in UiContainer in login load');
				throw error(500, 'Error with login page load');
			}
			console.log(err);
			throw error(500, 'Error with login page load');
		}
	);
};

export const POST: Action = async ({ request, setHeaders, url }) => {
	try {
		const values = await request.formData();

		const authMethod = values.get('auth_method') ?? undefined;
		const flowId = url.searchParams.get('flow') ?? undefined;
		const cookie = request.headers.get('cookie') ?? undefined;

		if (typeof authMethod !== 'string') {
			const err = new Error('No method attribute in post body');
			console.log(err);
			return {
				location: '/login'
			};
		}

		if (typeof flowId !== 'string') {
			const err = new Error('No flow id');
			console.log(err);
			return {
				location: '/login'
			};
		}

		const csrf_token = values.get('csrf_token') ?? undefined;
		if (authMethod === 'oidc') {
			const provider = values.get('provider') ?? undefined;
			if (typeof provider === 'string' && typeof csrf_token === 'string') {
				const flowBody: SubmitSelfServiceLoginFlowWithOidcMethodBody = {
					csrf_token,
					provider,
					method: authMethod
				};
				const { headers } = await auth.submitSelfServiceLoginFlow(
					flowId,
					flowBody,
					undefined,
					cookie
				);
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				return {
					location: '/'
				};
			}
			const err = new Error('Incorrect form data');
			console.log(err);
			return {
				location: '/login'
			};
		} else if (authMethod === 'password') {
			const identifier = values.get('identifier') ?? undefined;
			const password = values.get('password') ?? undefined;
			if (
				typeof identifier === 'string' &&
				typeof password === 'string' &&
				typeof csrf_token === 'string'
			) {
				const flowBody: SubmitSelfServiceLoginFlowWithPasswordMethodBody = {
					csrf_token,
					identifier,
					password,
					method: authMethod
				};
				const { headers } = await auth.submitSelfServiceLoginFlow(
					flowId,
					flowBody,
					undefined,
					cookie
				);
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				if (headers['location']) {
					return {
						location: headers['location']
					}
				} else {
					return {
						location: '/'
					};
				}
				
			}
			const err = new Error('Incorrect form data');
			console.log(err);
			return {
				location: '/login'
			};
		}
		const err = new Error('Login method not supported');
		console.log(err);
		return {
			location: '/login'
		};
	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.response && err.response.status === 400) {
				console.log(err);
				console.log('Login error page status');
				console.log(err.response.status);
				console.log('Login error page data');
				console.log(err.response.data);
				if (isSelfServiceLoginFlow(err.response.data)) {
					const action = modifyAction('/login', err.response.data.ui.action);
					if (action) {
						err.response.data.ui.action = action;
						return {
							errors: {
								ui: err.response.data.ui
							},
							status: 400
						};
					}
				}
			}
			return {
				location: '/login'
			};
		} else {
			console.log(err);
			return {
				location: '/login'
			};
		}
	}
};


/*
export const load: PageServerLoad = async ({
	parent,
	url,
	request,
	setHeaders
}): Promise<{ ui: UiContainer, title: string }> => {
	try {
		console.log('loading');
		const flowId = url.searchParams.get('flow') ?? undefined;
		const refresh = url.searchParams.get('refresh') === 'true' ? true : false;
		const aal = url.searchParams.get('aal') ?? undefined;
		const returnTo = url.searchParams.get('returnTo') ?? undefined;

		if (refresh) {
			const { data, headers } = await auth.initializeSelfServiceLoginFlowForBrowsers(
				refresh,
				aal,
				returnTo
			);
			
			const action = modifyAction('/login', data.ui.action);
			if (action) {
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				data.ui.action = action;
				return {
					ui: data.ui,
                    title: 'Forefinder Login'
				};
			}
			console.log('Err: No action in UiContainer in login load');
			throw error(500, 'Error with login page load');
		}

		const { user } = await parent();
		if (user) {
			console.log('User detected. Trying to redirect.');
			return redirect(307, '/');
		}

		if (!flowId) {
			console.log('Initializing Self Service Login Flow');
			const { data, headers } = await auth.initializeSelfServiceLoginFlowForBrowsers(
				refresh,
				aal,
				returnTo
			);
			
			const action = modifyAction('/login', data.ui.action);
			if (action) {
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				data.ui.action = action;
				return {
					ui: data.ui,
                    title: 'Forefinder Login'
				};
			}
			console.log('Err: No action in UiContainer in login load');
			throw error(500, 'Error with login page load');
		}

		let cookie = request.headers.get('cookie') ?? undefined;
		if (cookie) {
			cookie = decodeURIComponent(cookie);
		}
		const { data } = await auth.getSelfServiceLoginFlow(flowId, cookie);
		const action = modifyAction('/login', data.ui.action);
		if (action) {
			data.ui.action = action;
			return {
				ui: data.ui,
                title: 'Forefinder Login'
			};
		}
		console.log('Err: No action in UiContainer in login load');
		throw error(500, 'Error with login page load');
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.log(err);
			console.log('Login error page status');
			console.log(err.response?.status);
			console.log('Login error page data');
			console.log(err.response?.data);
			throw error(500, 'Error with login page load');
		} else {
			console.log(err);
			console.log('Error with login page load');
			throw error(500, 'Error with login page load');
		}
	}
};
*/
