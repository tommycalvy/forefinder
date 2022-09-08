import type { PageServerLoad, Action } from './$types';
import { auth, modifyAction } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type { UiContainer, SubmitSelfServiceRecoveryFlowBody } from '@ory/kratos-client';
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
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				ui.action = modifyAction('/recovery', ui.action);
				return {
					ui,
					title: 'Forefinder Recovery'
				};
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with recovery page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.getSelfServiceRecoveryFlow(flowId, cookie).then(
		({ data: { ui } }) => {
			ui.action = modifyAction('/recovery', ui.action);
			return {
				ui,
				title: 'Forefinder Recovery'
			};
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with recovery page load');
		}
	);
};

export const POST: Action = async ({ request, url }) => {
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
		throw redirect(303, '/recovery');
	}

	let flowBody: SubmitSelfServiceRecoveryFlowBody;

	if (authMethod === 'link') {
		const email = values.get('email') ?? undefined;
		const csrf_token = values.get('csrf_token') ?? undefined;
		if (typeof email === 'string' && typeof csrf_token === 'string') {
			flowBody = {
				csrf_token,
				email,
				method: authMethod
			};
		} else {
			const err = new Error('Incorrect form data');
			console.log(err);
			throw error(400, 'Incorrect form data');
		}
	} else {
		const err = new Error('Recovery method not supported');
		console.log(err);
		throw error(400, 'Recovery method not supported');
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.submitSelfServiceRecoveryFlow(flowId, flowBody, undefined, cookie).then(
		({ headers }) => {
			if (headers['location']) {
				throw redirect(302, headers['location']);
			} else {
				throw redirect(302, `/recovery?flow=${flowId}`);
			}
		},
		(err: AxiosError) => {
			if (err.response) {
				if (err.response.status === 400) {
					throw redirect(303, `/recovery?flow=${flowId}`);
				} else if (err.response.status === 500) {
					console.log(err.response.data);
				}
			}
			console.log(err);
			throw error(500, 'Recovery post submit error');
		}
	);
};
