import type { RequestHandler, RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

import { getFlow, getFlowError, initFlow, isFlowType } from '$lib/auth';

export const get: RequestHandler = async (event: RequestEvent): Promise<RequestHandlerOutput> => {

	try {
        const flowType = event.params.auth;

        if (!isFlowType(flowType)) {
			const err = new Error(`flow: ${flowType} doesn't exist in InitFlowType`);
            return {
                status: 400,
                body: JSON.stringify(err)
            }
		}

        if (flowType === 'error') {
            const error = event.request.headers.get('error') ?? undefined;
            if (error) {
                return getFlowError(error);
            } else {
                const err = new Error('no error given with flow type of error')
                return {
                    status: 400,
                    body: JSON.stringify(err)
                }
            }
        }

		const flowId = event.request.headers.get('flow_id') ?? undefined;
		const cookie = event.request.headers.get('cookie') ?? undefined;

        if (flowId && cookie) {
            console.log('get flow')
            return getFlow(flowType, flowId, cookie)
        }

        const refresh = event.request.headers.get('refresh') === 'true' ? true : false;

        const aal = event.request.headers.get('aal') ?? undefined;
		const returnTo = event.request.headers.get('return_to') ?? undefined;
		
        console.log('init flow')
        return initFlow({flowType, refresh, aal, returnTo});

       
    } catch (error) {
        console.log(error)
        return {
            status: 500
        }
    }
};
