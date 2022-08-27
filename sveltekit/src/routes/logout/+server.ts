import type { RequestHandler } from "@sveltejs/kit";



export const POST: RequestHandler = async () => {
    try {
		const { status, data, headers } = await auth.submitSelfServiceLogoutFlow(token, returnTo);
		console.log('submitLogoutFlow status');
		console.log(status);
		console.log('submitLogoutFlow data');
		console.log(data);
		console.log('submitLogoutFlow headers');
		console.log(headers);
		return {
			body: JSON.stringify(data),
			status,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	} catch (err) {
		console.log(err);
		if (axios.isAxiosError(err)) {
			console.log(err.response?.data);
			return {
				body: JSON.stringify(err.response?.data),
				status: err.response?.status,
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
		return {
			status: 500
		}
	}
}