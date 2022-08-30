import type { RequestHandler } from "@sveltejs/kit";
import { auth } from '$lib/auth';
import { error } from '@sveltejs/kit';
import axios from 'axios';



export const POST: RequestHandler = async ({ request, url, setHeaders }) => {

    try {
		console.log(request.headers);
        const token = request.headers.get('logout_token') ?? undefined;
		console.log('token: ', token);
        const returnTo = url.searchParams.get('returnTo') ?? '/login';

        if (!token) {
            throw error(400, 'No token included in header');
        }

		const { status, data, headers } = await auth.submitSelfServiceLogoutFlow(token, returnTo, {
			headers: {
				'cookie': request.headers.get('cookie')
			}
		});
		setHeaders({
			'set-cookie': headers['set-cookie']
		});
		console.log('submitLogoutFlow status');
		console.log(status);
		console.log('submitLogoutFlow data');
		console.log(data);
		console.log('submitLogoutFlow headers');
		console.log(headers);
		return new Response();
			 
	} catch (err) {
		
		if (axios.isAxiosError(err)) {
			console.log(err);
		} else {
			console.log(err);
		}
		throw error(500);
	}
}