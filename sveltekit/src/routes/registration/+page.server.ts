import type { Action, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { auth, isSelfServiceRegistrationFlow, modifyAction } from '$lib/auth';
import axios from 'axios';
import type {
	UiContainer,
	SubmitSelfServiceRegistrationFlowWithOidcMethodBody,
	SubmitSelfServiceRegistrationFlowWithPasswordMethodBody
} from '@ory/kratos-client';
import { colorGenerator } from "$lib/utils/color-generator";

export const load: PageServerLoad = async ({
	parent,
	url,
	setHeaders,
	request
}): Promise<{ ui: UiContainer; title: string }> => {
	try {
		const { user } = await parent();
		if (user) {
			throw redirect(307, '/');
		}

		const flowId = url.searchParams.get('flow') ?? undefined;
		const returnTo = url.searchParams.get('returnTo') ?? undefined;

		if (!flowId) {
			const { data, headers } = await auth.initializeSelfServiceRegistrationFlowForBrowsers(
				returnTo
			);

			const action = modifyAction('/registration', data.ui.action);
			if (action) {
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				data.ui.action = action;
				return {
					ui: data.ui,
					title: 'Forefinder Registration'
				};
			}
			console.log('Err: No action in UiContainer in registration load');
			throw error(500, 'Error with registration page load');
		}

		let cookie = request.headers.get('cookie') ?? undefined;
		if (cookie) {
			cookie = decodeURIComponent(cookie);
		}
		const { data } = await auth.getSelfServiceRegistrationFlow(flowId, cookie);
		const action = modifyAction('/registration', data.ui.action);
		if (action) {
			data.ui.action = action;
			return {
				ui: data.ui,
				title: 'Forefinder Registration'
			};
		}
		console.log('Err: No action in UiContainer in registration load');
		throw error(500, 'Error with registration page load');
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.log(err);
			console.log('Registration error page status');
			console.log(err.response?.status);
			console.log('Registration error page data');
			console.log(err.response?.data);
			throw error(500, 'Registration load error');
		} else {
			console.log(err);
			throw error(500, 'Registration load error');
		}
	}
};

export const POST: Action = async ({ request, url, setHeaders }) => {
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
		const color = colorGenerator();
		
		if (authMethod === 'oidc') {
			const provider = values.get('provider') ?? undefined;
			if (typeof provider === 'string' && typeof csrf_token === 'string') {
				const flowBody: SubmitSelfServiceRegistrationFlowWithOidcMethodBody = {
					csrf_token,
					provider,
					method: authMethod,
					traits: {
						email: values.get('traits.email') ?? undefined,
						name: {
							first: values.get('traits.name.first') ?? undefined
						},
						color,
					}
				};
				const { headers } = await auth.submitSelfServiceRegistrationFlow(flowId, flowBody, cookie);
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
				location: '/registration'
			};
		} else if (authMethod === 'password') {
			const password = values.get('password') ?? undefined;
			if (typeof password === 'string' && typeof csrf_token === 'string') {
				const flowBody: SubmitSelfServiceRegistrationFlowWithPasswordMethodBody = {
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
				const { headers } = await auth.submitSelfServiceRegistrationFlow(flowId, flowBody, cookie);
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
				location: '/registration'
			};
		}
		const err = new Error('Registration method not supported');
		console.log(err);
		return {
			location: '/registration'
		};
	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.response && err.response.status === 400) {
				console.log(err);
				console.log('Registration error page status');
				console.log(err.response.status);
				console.log('Registration error page data');
				console.log(err.response.data);
				if (isSelfServiceRegistrationFlow(err.response.data)) {
					const action = modifyAction('/registration', err.response.data.ui.action);
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
				location: '/registration'
			};
		} else {
			console.log(err);
			return {
				location: '/registration'
			};
		}
	}
};
