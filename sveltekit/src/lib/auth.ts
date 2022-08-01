import type { RequestHandlerOutput } from '@sveltejs/kit';
import { Configuration, V0alpha2Api  } from '@ory/kratos-client';
import type {
	GenericError,
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

export type AuthFlow =
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

export const isFlowType = (flow: string): flow is FlowType => {
	return ['registration', 'login', 'settings', 'verification', 'recovery', 'error'].includes(flow);
};

export type InitFlowType = 'registration' | 'login' | 'settings' | 'verification' | 'recovery';

const isInitFlowType = (flow: string): flow is InitFlowType => {
	return ['registration', 'login', 'settings', 'verification', 'recovery'].includes(flow);
};

const handleInitFlowError = (error: AuthFlow | GenericError): RequestHandlerOutput => {
	console.log(error);
	switch (error.id) {
		case 'session_already_available': {
			const redirectTo = '/';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
		case 'session_aal1_required': {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
		case 'security_csrf_violation': {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
		case 'security_identity_mismatch': {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
		default: {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	}
}

export interface InitFlowParams {
	flowType: string, 
	refresh: boolean | undefined, 
	aal: string | undefined
	returnTo: string | undefined,
}

export const initFlow = async({ flowType, refresh, aal, returnTo } : InitFlowParams): Promise<RequestHandlerOutput> => {
	try {
		if (!isInitFlowType(flowType)) {
			throw new Error(`flow: ${flowType} doesn't exist in InitFlowType`);
		}

		switch (flowType) {
			case 'login': {
				const { status, data } = await auth.initializeSelfServiceLoginFlowForBrowsers(refresh, aal, returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'Content-Type': 'application/json'
						}
					}
				} else {
					return handleInitFlowError(data)
				}
			}
			case 'recovery': {
				const {status, data } = await auth.initializeSelfServiceRecoveryFlowForBrowsers(returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'Content-Type': 'application/json'
						}
					}
				} else {
					return handleInitFlowError(data)
				}
			}
			case 'registration': {
				const {status, data } = await auth.initializeSelfServiceRegistrationFlowForBrowsers(returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'Content-Type': 'application/json'
						}
					}
				} else {
					return handleInitFlowError(data)
				}
			}
			case 'settings': {
				const {status, data } = await auth.initializeSelfServiceSettingsFlowForBrowsers(returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'Content-Type': 'application/json'
						}
					}
				} else {
					return handleInitFlowError(data)
				}
			}
			case 'verification': {
				const {status, data } = await auth.initializeSelfServiceVerificationFlowForBrowsers(returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'Content-Type': 'application/json'
						}
					}
				} else {
					return handleInitFlowError(data)
				}
			}
		}
	} catch (error) {
		console.log(error)
		const redirectTo = '/login';
		return {
			status: 400,
			body: JSON.stringify(redirectTo),
			headers: {
				'Content-Type': 'application/json'
			}
		}
	}
}

export const getFlowError = async(error: string): Promise<RequestHandlerOutput> => {
	const { status, data } = await auth.getSelfServiceError(error);
	return {
		body: JSON.stringify(data),
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	}
}

export const getFlow = async (flowType: string, flowId: string, cookie: string): Promise<RequestHandlerOutput> => {
	try {
		if (!isFlowType(flowType)) {
			throw new Error(`flow: ${flowType} doesn't exist in FlowType`);
		}
		switch (flowType) {
			case 'login': {
				const { status, data } = await auth.getSelfServiceLoginFlow(flowId, cookie);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
			case 'recovery': {
				const { status, data } = await auth.getSelfServiceRecoveryFlow(flowId, cookie);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
			case 'registration': {
				const { status, data } = await auth.getSelfServiceRegistrationFlow(flowId, cookie);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
			case 'settings': {
				const { status, data } = await auth.getSelfServiceSettingsFlow(flowId, undefined, cookie);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
			case 'verification': {
				const { status, data } = await auth.getSelfServiceVerificationFlow(flowId, cookie);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
			default: {
				const error = 'Flow type does not exist'
				return {
					body: JSON.stringify(error),
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			}
		}
	} catch (error) {
		return {
			body: JSON.stringify(error),
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	}
};
