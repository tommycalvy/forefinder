import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async ({ session, url, fetch }) => {
	if (session.user) {
		throw redirect(302, '/');
	}

	const flowId = url.searchParams.get('flow') ?? undefined;
	const returnTo = url.searchParams.get('return_to') ?? undefined;

	const headersInit =
		flowId && returnTo
			? new Headers({ flow_id: flowId, return_to: returnTo })
			: flowId
			? new Headers({ flow_id: flowId })
			: undefined;

	const res = await fetch('/auth/login', {
		headers: headersInit
	});

	if (!res.ok) {
		throw redirect(302, '/login');
	}

	const { id, ui, refresh, requested_aal } = await res.json();
	
	
	if (!flowId) {
		const url = returnTo ? `/login?flow=${id}&return_to=${returnTo}` : `/login?flow=${id}`;
		throw redirect(303, url);
	}
	
	return { id, ui, refresh, requested_aal };
};
