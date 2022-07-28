import type { RequestHandlerOutput } from '@sveltejs/kit';
import { Configuration, V0alpha2Api } from '@ory/kratos-client';
import type {
	SelfServiceError,
	SelfServiceLoginFlow,
	SelfServiceRecoveryFlow,
	SelfServiceRegistrationFlow,
	SelfServiceSettingsFlow,
	SelfServiceVerificationFlow
} from '@ory/kratos-client';
import config from '$lib/config';

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
	verified: boolean;
}

export type TAuthFlow =
	| SelfServiceLoginFlow
	| SelfServiceRegistrationFlow
	| SelfServiceRecoveryFlow
	| SelfServiceSettingsFlow
	| SelfServiceVerificationFlow;

export type FlowType =
	| 'registration'
	| 'login'
	| 'settings'
	| 'verification'
	| 'recovery'
	| 'error';

const isFlowType = (flow: string): flow is FlowType => {
	return ['registration', 'login', 'settings', 'verification', 'recovery', 'error'].includes(flow);
};

export const authFlowMap: Record<string, string> = {
	registration: 'getSelfServiceRegistrationFlow',
	recovery: 'getSelfServiceRecoveryFlow',
	verification: 'getSelfServiceVerificationFlow',
	settings: 'getSelfServiceSettingsFlow',
	error: 'getSelfServiceError',
	login: 'getSelfServiceLoginFlow'
};

export interface GetAuthFlowParams {
	flowType: string;
	flowId: string | undefined;
	cookie: string | undefined;
	returnTo: string | undefined;
	error: string | undefined;
}

export interface GetAuthDataResponse {
	status: number;
	data: TAuthFlow | SelfServiceError;
}

export const getAuthFlow = async ({
	flowType,
	flowId,
	cookie,
	returnTo,
	error
}: GetAuthFlowParams): Promise<RequestHandlerOutput> => {
	try {
		if (!isFlowType(flowType)) {
			throw new Error(`flow: ${flowType} doesn't exist in FlowType`);
		}

		let authPromise: Promise<GetAuthDataResponse>;

		switch (flowType) {
			case 'error': {
				if (error) {
					authPromise = auth.getSelfServiceError(error);
				} else {
					throw new Error('error is undefined');
				}
				break;
			}
			case 'login': {
				if (flowId) {
					if (cookie) {
						authPromise = auth.getSelfServiceLoginFlow(flowId, cookie);
					} else {
						throw new Error('no cookie present with flowType of login');
					}
				} else {
					authPromise = auth.initializeSelfServiceLoginFlowForBrowsers(false, undefined, returnTo);
				}
				break;
			}
			case 'recovery': {
				if (flowId) {
					if (cookie) {
						authPromise = auth.getSelfServiceRecoveryFlow(flowId, cookie);
					} else {
						throw new Error('no cookie present with flowType of recovery');
					}
				} else {
					authPromise = auth.initializeSelfServiceRecoveryFlowForBrowsers(returnTo);
				}
				break;
			}
			case 'registration': {
				if (flowId) {
					if (cookie) {
						authPromise = auth.getSelfServiceRegistrationFlow(flowId, cookie);
					} else {
						throw new Error('no cookie present with flowType of registration');
					}
				} else {
					authPromise = auth.initializeSelfServiceRegistrationFlowForBrowsers(returnTo);
				}
				break;
			}
			case 'settings': {
				if (flowId) {
					if (cookie) {
						authPromise = auth.getSelfServiceSettingsFlow(flowId, undefined, cookie);
					} else {
						throw new Error('no cookie present with flowType of settings');
					}
				} else {
					authPromise = auth.initializeSelfServiceSettingsFlowForBrowsers(returnTo);
				}
				break;
			}
			case 'verification': {
				if (flowId) {
					if (cookie) {
						authPromise = auth.getSelfServiceVerificationFlow(flowId, cookie);
					} else {
						throw new Error('no cookie present with flowType of verification');
					}
				} else {
					authPromise = auth.initializeSelfServiceVerificationFlowForBrowsers(returnTo);
				}
				break;
			}
			default: {
				authPromise = auth.initializeSelfServiceLoginFlowForBrowsers(false, undefined, returnTo);
				break;
			}
		}

		const { status, data }: GetAuthDataResponse = await authPromise;

		const jsonData = JSON.stringify(data);

		return {
			body: jsonData,
			status,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	} catch (error) {
		const jsonError = JSON.stringify(error);

		return {
			body: jsonError,
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	}
};
