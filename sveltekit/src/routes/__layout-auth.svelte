<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import config from '$lib/config'
	import type { GetAuthDataResponse } from "$lib/auth";

	export const load: Load = async ({ session, url, fetch }) => {
		if (session.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		const flowType = url.pathname.substring(1);

		const flowId = url.searchParams.get('flow') ?? undefined;
		const headersInit = flowId ? new Headers({
			flowId: flowId
		}) : undefined;
		const res = await fetch(`/auth/${flowType}`, {
			headers: headersInit
		});

		const { status, data: flow } : GetAuthDataResponse = await res.json();
		console.log(flow)
		const ui = 'ui' in flow ? flow.ui : undefined
		const error = 'error' in flow ? flow.error : undefined

		return {
			props: {
				ui: ui,
				error: error
			}
		};
	};
</script>

<script lang="ts">
	export let flowType: string;
	export let flowId: string | null;
</script>

<main>
	<h1> flowType: {flowType} </h1>
	<h1>flowId: {flowId}</h1>
	<slot />
</main>
