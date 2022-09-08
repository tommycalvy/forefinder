import type { PageServerLoad, Action } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { auth, modifyAction } from '$lib/auth';
import type { UiContainer, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client';
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

	if (!refresh) {
		const { user } = await parent();
		if (user) {
			console.log('User detected. Redirecting to /');
			throw redirect(307, '/');
		}
	}
	
	if (!flowId) {
		return await auth.initializeSelfServiceLoginFlowForBrowsers(refresh, aal, returnTo).then(
			({ data: { ui }, headers }) => {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = modifyAction('/login', ui.action);;
					console.log('About to return ui');
					return {
						ui,
						title: 'Forefinder Login'
					};
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with login page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.getSelfServiceLoginFlow(flowId, cookie).then(
		({ data: { ui } }) => {
				ui.action = modifyAction('/login', ui.action);
				return {
					ui,
					title: 'Forefinder Login'
				};
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with login page load');
		}
	);
};

export const POST: Action = async ({ request, setHeaders, url }) => {

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

	const csrf_token = values.get('csrf_token') ?? undefined;
	let flowBody: SubmitSelfServiceLoginFlowBody;

	if (authMethod === 'oidc') {
		const provider = values.get('provider') ?? undefined;
		if (typeof provider === 'string' && typeof csrf_token === 'string') {
			flowBody = {
				csrf_token,
				provider,
				method: authMethod
			};
		} else {
			throw error(400, 'Incorrect form data');
		}
	} else if (authMethod === 'password') {
		const identifier = values.get('identifier') ?? undefined;
		const password = values.get('password') ?? undefined;
		if (
			typeof identifier === 'string' &&
			typeof password === 'string' &&
			typeof csrf_token === 'string'
		) {
			flowBody = {
				csrf_token,
				identifier,
				password,
				method: authMethod
			};
		} else {
			throw error(400, 'Incorrect form data');
		}
	} else {
		const err = new Error('Login method not supported');
		console.log(err);
		throw error(400, 'Login method not supported');
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.submitSelfServiceLoginFlow(flowId, flowBody, undefined, cookie).then(
		({ headers }) => {
			setHeaders({
				'set-cookie': headers['set-cookie']
			});
			if (headers['location']) {
				throw redirect(302, headers['location']);
			} else {
				throw redirect(302, '/');
			}
		},
		(err: AxiosError) => {
			if (err.response) {
				if (err.response.status === 400) {
					throw redirect(303, `/login?flow=${flowId}`);
				}
				console.log('Unhandled ory kratos error');
			}
			throw error(500, 'Error with login submit');
		}
	);
};