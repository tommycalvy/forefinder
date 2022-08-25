import { Configuration, V0alpha2Api, type UiContainer } from '@ory/kratos-client';
import config from '$lib/config';
import type { SelfServiceLoginFlow } from '@ory/kratos-client';

export const auth = new V0alpha2Api(
	new Configuration({
		basePath: config.kratos.public,
		baseOptions: {
			withCredentials: true
		}
	})
);

export interface User {
	id: string;
	email: string;
	name: string;
	verified: boolean;
}

export const isSelfServiceLoginFlow = (obj: unknown): obj is SelfServiceLoginFlow => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'expires_at' in obj &&
		'id' in obj &&
		'issued_at' in obj &&
		'request_url' in obj &&
		'type' in obj &&
		'ui' in obj
	);
};

export interface ValidationErrors {
	ui: UiContainer;
}

export const modifyAction = (base: string, action: string): string | undefined => {
    const url = new URL(action);
	const urlParams = new URLSearchParams(url.search);
    const flow = urlParams.get('flow') ?? undefined;
    if (flow) {
        return base + '?flow=' + flow;
    }
	return undefined;
};
