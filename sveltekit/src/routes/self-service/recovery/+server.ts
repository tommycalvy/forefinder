import type { RequestHandler } from '@sveltejs/kit';
import config from '$lib/config';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, request }) => {
	console.log('self-service/recovery ran!');
	const publicUrl = config.kratos.public;
	const flowId = url.searchParams.get('flow') ?? undefined;
	const token = url.searchParams.get('token') ?? undefined;
    let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	}

	if (!flowId || !token) {
		throw error(400, 'Incorrect query parameters');
	}
	
    const recoveryHeaders = cookie ? new Headers({ 'cookie': cookie }) : undefined;
    return await fetch(`${publicUrl}/self-service/recovery?flow=${flowId}&token=${token}`, {
        headers: recoveryHeaders
    }).then((response) => {
        console.log('/self-service/recovery flow and token get response');
        console.log(response);
        console.log('headers');
        console.log(...response.headers);
        
        throw redirect(303, `/recovery?flow=${flowId}`);
    });
    
};
