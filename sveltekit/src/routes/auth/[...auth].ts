import type { RequestHandler, RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

import {
	getFlow,
	getFlowError,
	initFlow,
	isFlowType,
    postFlow,
} from '$lib/auth';

export const get: RequestHandler = async (event: RequestEvent): Promise<RequestHandlerOutput> => {
	try {
		const flowType = event.params.auth;

		if (!isFlowType(flowType)) {
			const err = new Error(`flow: ${flowType} doesn't exist in InitFlowType`);
            console.log(err);
			return {
				status: 400
			};
		}

		if (flowType === 'error') {
			const error = event.request.headers.get('error') ?? undefined;
			if (error) {
				return getFlowError(error);
			} else {
				const err = new Error('no error given with flow type of error');
                console.log(err);
				return {
					status: 400
				};
			}
		}

		const flowId = event.request.headers.get('flow_id') ?? undefined;
		const cookie = event.request.headers.get('cookie') ?? undefined;

		if (flowId && cookie) {
			console.log('get flow');
			return getFlow(flowType, flowId, cookie);
		}

		const refresh = event.request.headers.get('refresh') === 'true' ? true : false;

		const aal = event.request.headers.get('aal') ?? undefined;
		const returnTo = event.request.headers.get('return_to') ?? undefined;

		console.log('init flow');
		return initFlow({ flowType, refresh, aal, returnTo });
	} catch (error) {
		console.log(error);
		return {
			status: 500
		};
	}
};

export const post: RequestHandler = async (event: RequestEvent): Promise<RequestHandlerOutput> => {
	try {
		const flowType = event.params.auth;

		if (!isFlowType(flowType)) {
			const err = new Error(`flow: ${flowType} doesn't exist in InitFlowType`);
            console.log(err);
			return {
				status: 400
			};
		}

		const formData = await event.request.formData();
        console.log(formData.get('identifier'));

		const flowId = event.request.headers.get('flow_id') ?? undefined;
		const cookie = event.request.headers.get('cookie') ?? undefined;

		if (flowId && cookie) {
			return postFlow(flowType, flowId, cookie, formData);
		}

		const err = new Error('No flow ID or cookie');
        console.log(err);
		return {
			status: 400
		};
	} catch (error) {
		console.log(error);
		return {
			status: 500
		};
	}
};
