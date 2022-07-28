import type { RequestHandler, RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

import { getAuthFlow } from '$lib/auth';

export const get: RequestHandler = async (event: RequestEvent): Promise<RequestHandlerOutput> => {
	return getAuthFlow({
		flowType: event.params.auth,
		flowId: event.request.headers.get('flowId') ?? undefined,
		cookie: event.request.headers.get('cookie') ?? undefined,
		returnTo: event.request.headers.get('redirect') ?? undefined,
		error: event.request.headers.get('error') ?? undefined,
	});
};
