import type { PageServerLoad, Action } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import type {
	UiContainer,
	SubmitSelfServiceLoginFlowWithOidcMethodBody,
	SubmitSelfServiceLoginFlowWithPasswordMethodBody
} from '@ory/kratos-client';
import axios from 'axios';

export const load: PageServerLoad = async ({
	parent,
	url,
	request,
	setHeaders
}): Promise<{ ui: UiContainer }> => {
	try {
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
			setHeaders({
				'cache-control': headers['cache-control'],
				'content-type': headers['content-type'],
				'set-cookie': headers['set-cookie']
			});
			return {
				ui: data.ui
			};
		}

		const { user } = await parent();
		if (user) {
			throw redirect(307, '/');
		}

		if (!flowId) {
			const { data, headers } = await auth.initializeSelfServiceLoginFlowForBrowsers(
				refresh,
				aal,
				returnTo
			);
			data.ui.action = '/login';
			setHeaders({
				'cache-control': headers['cache-control'],
				'content-type': headers['content-type'],
				'set-cookie': headers['set-cookie']
			});
			return {
				ui: data.ui
			};
		}

		let cookie = request.headers.get('cookie') ?? undefined;
		if (cookie) {
			cookie = decodeURIComponent(cookie);
		}
		const { data } = await auth.getSelfServiceLoginFlow(flowId, cookie);
		return {
			ui: data.ui
		};
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.log(err);
			console.log('Login error page status');
			console.log(err.response?.status);
			console.log('Login error page data');
			console.log(err.response?.data);
			throw error(err.response?.status ?? 500, err.response?.data);
		} else {
			console.log(err);
			throw error(500, 'Error with login page load');
		}
	}
};

export const post: Action = async ({ request, setHeaders }) => {
	const values = await request.formData();

	const method = values.get('method') ?? undefined;

	if (typeof method !== 'string') {
		return {
			status: 400,
			error: new Error('No method attribute in post body')
		};
	}
	const csrf_token = values.get('csrf_token') ?? undefined;
	if (method === 'oidc') {
		const provider = values.get('provider') ?? undefined;
		if (typeof provider === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceLoginFlowWithOidcMethodBody = {
				csrf_token,
				provider,
				method
			};
			return { flowBody };
		}
		return {
            status: 400,
			error: new Error('Incorrect form data')
		};
	} else if (method === 'password') {
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
				method
			};
			return { flowBody };
		}
		return {
            status: 400,
			error: new Error('Incorrect form data')
		};
	}
	return {
        status: 400,
		error: new Error('Login method not supported')
	};
};
