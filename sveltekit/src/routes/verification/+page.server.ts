import type { PageServerLoad, Action } from './$types';
import { auth, modifyAction } from '$lib/auth';
import { error } from '@sveltejs/kit';
import type {
	UiContainer,
	SubmitSelfServiceVerificationFlowWithLinkMethodBody
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
		return await auth.initializeSelfServiceVerificationFlowForBrowsers(returnTo).then(
			({ data: { ui }, headers }) => {
				const action = modifyAction('/verification', ui.action);
				if (action) {
					setHeaders({
						'set-cookie': headers['set-cookie']
					});
					ui.action = action;
					return {
						ui,
						title: 'Forefinder Email Verification'
					};
				}
				console.log('Err: No action in UiContainer in verification load');
				throw error(500, 'Error with verification page load');
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with verification page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}

	return await auth.getSelfServiceVerificationFlow(flowId, cookie).then(
		({ data: { ui } }) => {
			const action = modifyAction('/verification', ui.action);
			if (action) {
				ui.action = action;
				return {
					ui,
					title: 'Forefinder Email Verification'
				};
			}
			console.log('Err: No action in UiContainer in verification load');
			throw error(500, 'Error with verification page load');
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with verification page load');
		}
	);
};

export const POST: Action = async ({ request, url }) => {
    console.log('Verification POST began');
	const flowId = url.searchParams.get('flow') ?? undefined;

	if (!flowId) {
		return {
			location: '/verification'
		};
	}

	const values = await request.formData();

	const authMethod = values.get('auth_method') ?? undefined;

	if (typeof authMethod !== 'string') {
		const err = new Error('No method attribute in post body');
		console.log(err);
		return {
			location: '/verification'
		};
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}
	if (authMethod === 'link') {
		const email = values.get('email') ?? undefined;
		const csrf_token = values.get('csrf_token') ?? undefined;
		if (typeof email === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceVerificationFlowWithLinkMethodBody = {
				csrf_token,
				email,
				method: authMethod
			};
            console.log(flowBody);
			return await auth.submitSelfServiceVerificationFlow(flowId, flowBody, undefined, cookie).then(
				({ data }) => {
                    console.log(data);
					const action = modifyAction('/verification', data.ui.action);
					if (action) {
						data.ui.action = action;
						return {
                            errors: {
                                ui: data.ui, 
                            },
                            status: 200
                        } 
					} else {
						console.log('AxiosError: No action in UiContainer in verification post');
						return {
							location: '/verification'
						};
					}
				},
				(err: AxiosError) => {
					if (err.response) {
						if (err.response.status === 400) {
                            console.log(err.response.data);
							const action = modifyAction('/verification', err.response.data.ui.action);
							if (action) {
								err.response.data.ui.action = action;
								return {
                                    errors: {
                                        ui: err.response.data.ui 
                                    },
                                    status: 400
                                } 
							} else {
								console.log('AxiosError: No action in UiContainer in verification post');
								return {
									location: '/verification'
								};
							}
						} else if (err.response.status === 500) {
                            console.log(err.response.data);
                            return {
                                location: '/verification'
                            }
                        } else {
                            console.log(err);
                            return {
                                location: '/verification'
                            }
                        }
					} else {
                        console.log(err);
						return {
							location: '/verification'
						};
					}
				}
			);
		}
	}
	const err = new Error('Verification method not supported');
	console.log(err);
	return {
		location: '/verification'
	};
};
