import type { PageServerLoad, Action } from './$types';
import { auth, modifyAction } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type {
	UiContainer,
	SubmitSelfServiceVerificationFlowBody
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
				setHeaders({
					'set-cookie': headers['set-cookie']
				});
				ui.action = modifyAction('/verification', ui.action);
				return {
					ui,
					title: 'Forefinder Email Verification'
				};
			},
			(err) => {
				console.log(err);
				throw error(500, 'Error with verification page load');
			}
		);
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.getSelfServiceVerificationFlow(flowId, cookie).then(
		({ data: { ui } }) => {
			ui.action = modifyAction('/verification', ui.action);
			return {
				ui,
				title: 'Forefinder Email Verification'
			};
		},
		(err) => {
			console.log(err);
			throw error(500, 'Error with verification page load');
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

	let flowBody: SubmitSelfServiceVerificationFlowBody;
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
			throw error(400, 'Incorrect form data');
		}
	} else {
		const err = new Error('Verification method not supported');
		console.log(err);
		throw error(400, 'Verification method not supported');
	}

	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) cookie = decodeURIComponent(cookie);

	return await auth.submitSelfServiceVerificationFlow(flowId, flowBody, undefined, cookie).then(
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
				} else if (err.response.status === 500) {
					console.log(err.response.data);
				}
			}
			console.log(err);
			throw error(500, 'Verification post submit error');
		}
	);
};
