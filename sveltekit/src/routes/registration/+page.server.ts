import type { Action, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { auth, modifyAction } from '$lib/auth';
import type { UiContainer, SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client';
import { colorGenerator } from '$lib/utils/color-generator';
import type { AxiosError } from 'axios';

export const load: PageServerLoad = async ({
	parent,
	url,
	setHeaders,
	request
}): Promise<{ ui: UiContainer; title: string }> => {
	const { user } = await parent();
	if (user) {
		throw redirect(307, '/');
	}

	const flowId = url.searchParams.get('flow') ?? undefined;
	const returnTo = url.searchParams.get('returnTo') ?? undefined;

	if (!flowId) {
		return await auth.initializeSelfServiceRegistrationFlowForBrowsers(returnTo).then(
			({ data: { ui }, headers }) => {
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				ui.action = modifyAction('/registration', ui.action);
				return {
					ui,
					title: 'Forefinder Registration'
				};
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with registration page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.getSelfServiceRegistrationFlow(flowId, cookie).then(
		({ data: { ui } }) => {
			ui.action = modifyAction('/registration', ui.action);
			return {
				ui,
				title: 'Forefinder Registration'
			};
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with registration page load');
		}
	);
};

export const POST: Action = async ({ request, url, setHeaders }) => {

	const flowId = url.searchParams.get('flow') ?? undefined;
	if (typeof flowId !== 'string') {
		const err = new Error('No flow id');
		console.log(err);
		throw error(500, 'No flow id');
	}

	const values = await request.formData();
	const authMethod = values.get('auth_method') ?? undefined;
	if (typeof authMethod !== 'string') {
		const err = new Error('No method attribute in post body');
		console.log(err);
		throw error(500, 'No method attribute in post body');
	}

	const csrf_token = values.get('csrf_token') ?? undefined;
	const color = colorGenerator();
	let flowBody: SubmitSelfServiceRegistrationFlowBody;
	
	if (authMethod === 'oidc') {
		const provider = values.get('provider') ?? undefined;
		if (typeof provider === 'string' && typeof csrf_token === 'string') {
			flowBody = {
				csrf_token,
				provider,
				method: authMethod,
				traits: {
					email: values.get('traits.email') ?? undefined,
					name: {
						first: values.get('traits.name.first') ?? undefined
					},
					color
				}
			};
		} else {
			const err = new Error('Incorrect form data');
			console.log(err);
			throw error(400, 'Incorrect form data');
		}
	} else if (authMethod === 'password') {
		const password = values.get('password') ?? undefined;
		if (typeof password === 'string' && typeof csrf_token === 'string') {
			flowBody = {
				csrf_token,
				password,
				method: authMethod,
				traits: {
					email: values.get('traits.email'),
					name: {
						first: values.get('traits.name.first')
					},
					color
				}
			};
		} else {
			const err = new Error('Incorrect form data');
			console.log(err);
			throw error(400, 'Incorrect form data');
		}
	} else {
		const err = new Error('Registration method not supported');
		console.log(err);
		throw error(400, 'Registration method not supported');
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.submitSelfServiceRegistrationFlow(flowId, flowBody, cookie).then(
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
					throw redirect(303, `/registration?flow=${flowId}`);
				} else if (err.response.status === 500) {
					console.log(err.response.data);
				}
			}
			console.log(err);
			throw error(500, 'Registration post submit error');
		}
	);
};
