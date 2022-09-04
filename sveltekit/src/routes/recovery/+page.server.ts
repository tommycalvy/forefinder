import type { PageServerLoad, Action } from './$types';
import { auth, modifyAction } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type {
	UiContainer,
	SubmitSelfServiceRecoveryFlowWithLinkMethodBody
} from '@ory/kratos-client';
import type { AxiosError } from 'axios';

export const load: PageServerLoad = async ({
	url,
	setHeaders,
	request
}): Promise<{ ui: UiContainer; title: string }> => {
	const flowId = url.searchParams.get('flow') ?? undefined;
	const returnTo = url.searchParams.get('returnTo') ?? undefined;

	if (!flowId) {
		return await auth.initializeSelfServiceRecoveryFlowForBrowsers(returnTo).then(
			({ data: { ui }, headers }) => {
				const action = modifyAction('/recovery', ui.action);
				if (action) {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = action;
					return {
						ui,
						title: 'Forefinder Recovery'
					};
				}
				console.log('Err: No action in UiContainer in recovery load');
				throw error(500, 'Error with recovery page load');
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with recovery page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}

	return await auth.getSelfServiceRecoveryFlow(flowId, cookie).then(
		({ data: { ui } }) => {
			const action = modifyAction('/recovery', ui.action);
			if (action) {
				ui.action = action;
				return {
					ui,
					title: 'Forefinder Recovery'
				};
			}
			console.log('Err: No action in UiContainer in recovery load');
			throw error(500, 'Error with recovery page load');
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with recovery page load');
		}
	);
};

export const POST: Action = async ({ request, url }) => {
	console.log('Recovery POST began');
	const flowId = url.searchParams.get('flow') ?? undefined;

	if (!flowId) {
		throw redirect(303, '/recovery');
	}

	const values = await request.formData();

	const authMethod = values.get('auth_method') ?? undefined;

	if (typeof authMethod !== 'string') {
		const err = new Error('No method attribute in post body');
		console.log(err);
		throw redirect(303, '/recovery');
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}
	if (authMethod === 'link') {
		const email = values.get('email') ?? undefined;
		const csrf_token = values.get('csrf_token') ?? undefined;
		if (typeof email === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceRecoveryFlowWithLinkMethodBody = {
				csrf_token,
				email,
				method: authMethod
			};
			console.log(flowBody);
			return await auth.submitSelfServiceRecoveryFlow(flowId, flowBody, undefined, cookie).then(
				({ data }) => {
					console.log(data);
					const action = modifyAction('/recovery', data.ui.action);
					if (action) {
						data.ui.action = action;
						return {
							errors: {
								ui: data.ui
							},
							status: 200
						};
					} else {
						console.log('AxiosError: No action in UiContainer in recovery post');
						throw redirect(303, '/recovery');
					}
				},
				(err: AxiosError) => {
					if (err.response) {
						if (err.response.status === 400) {
							console.log(err.response.data);
							const action = modifyAction('/recovery', err.response.data.ui.action);
							if (action) {
								err.response.data.ui.action = action;
								return {
									errors: {
										ui: err.response.data.ui
									},
									status: 400
								};
							} else {
								console.log('AxiosError: No action in UiContainer in verification post');
								throw redirect(303, '/recovery');
							}
						} else if (err.response.status === 500) {
							console.log(err.response.data);
							throw redirect(303, '/recovery');
						}
					}
					console.log(err);
					throw redirect(303, '/recovery');
				}
			);
		}
	}
	const err = new Error('Recovery method not supported');
	console.log(err);
	throw redirect(303, '/recovery');
};
