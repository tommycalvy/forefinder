<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { UiContainer } from "@ory/kratos-client";

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

		const body = res.body;
		const status = res.status;
		const data = await res.json();

		console.log(status)
		console.log(data)

		return {
			props: {
				status: status,
				data: data,
			}
		};
	};
</script>

<script lang="ts">
	export let status;
	export let data;
	console.log(status);
	console.log(data);
</script>

<main>
	<slot />
</main>
