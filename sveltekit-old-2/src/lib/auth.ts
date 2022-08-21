import type { RequestHandlerOutput } from '@sveltejs/kit';
import { Configuration, V0alpha2Api } from '@ory/kratos-client';
import type {
	SubmitSelfServiceLoginFlowWithOidcMethodBody,
	SubmitSelfServiceLoginFlowWithPasswordMethodBody,
	SubmitSelfServiceLoginFlowBody,
	SubmitSelfServiceRecoveryFlowBody,
	SubmitSelfServiceRegistrationFlowBody,
	SubmitSelfServiceRegistrationFlowWithPasswordMethodBody,
	SubmitSelfServiceRecoveryFlowWithLinkMethodBody,
	SubmitSelfServiceRegistrationFlowWithOidcMethodBody,
	SubmitSelfServiceSettingsFlowBody,
	SubmitSelfServiceSettingsFlowWithOidcMethodBody,
	SubmitSelfServiceSettingsFlowWithPasswordMethodBody,
	SubmitSelfServiceSettingsFlowWithProfileMethodBody,
	SubmitSelfServiceVerificationFlowBody,
	SubmitSelfServiceVerificationFlowWithLinkMethodBody,
	GenericError
} from '@ory/kratos-client';
import config from '$lib/config';
import axios from 'axios';

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

export type FlowType =
	| 'registration'
	| 'login'
	| 'settings'
	| 'verification'
	| 'recovery'
	| 'error'
	| 'logout';

export const isFlowType = (flow: string): flow is FlowType => {
	return ['registration', 'login', 'settings', 'verification', 'recovery', 'error', 'logout'].includes(flow);
};

const handleInitFlowError = (error: string): RequestHandlerOutput => {
	console.log(error);
	switch (error) {
		case 'session_already_available': {
			const redirectTo = '/';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
		case 'session_aal1_required': {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
		case 'security_csrf_violation': {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
		case 'security_identity_mismatch': {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
		default: {
			const redirectTo = '/login';
			return {
				status: 400,
				body: JSON.stringify(redirectTo),
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
	}
};

export interface InitFlowParams {
	flowType: FlowType;
	refresh: boolean | undefined;
	aal: string | undefined;
	returnTo: string | undefined;
}

export const initFlow = async ({
	flowType,
	refresh,
	aal,
	returnTo
}: InitFlowParams): Promise<RequestHandlerOutput> => {
	try {
		switch (flowType) {
			case 'login': {
				const { status, data, headers } = await auth.initializeSelfServiceLoginFlowForBrowsers(
					refresh,
					aal,
					returnTo
				);
				//console.log('csrf from init flow body');
				//console.log(data.ui.nodes[0].attributes);
				//console.log('csrf from set-cookie');
				//console.log(headers['set-cookie']);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'cache-control': headers['cache-control'],
							'content-type': headers['content-type'],
							'set-cookie': headers['set-cookie']
						}
					};
				} else {
					console.log(data);
					return handleInitFlowError(data.id);
				}
			}
			case 'recovery': {
				const { status, data, headers } = await auth.initializeSelfServiceRecoveryFlowForBrowsers(
					returnTo
				);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'cache-control': headers['cache-control'],
							'content-type': headers['content-type'],
							'set-cookie': headers['set-cookie']
						}
					};
				} else {
					console.log(data);
					return handleInitFlowError(data.id);
				}
			}
			case 'registration': {
				const { status, data, headers } =
					await auth.initializeSelfServiceRegistrationFlowForBrowsers(returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'cache-control': headers['cache-control'],
							'content-type': headers['content-type'],
							'set-cookie': headers['set-cookie']
						}
					};
				} else {
					console.log(data);
					return handleInitFlowError(data.id);
				}
			}
			case 'settings': {
				const { status, data, headers } = await auth.initializeSelfServiceSettingsFlowForBrowsers(
					returnTo
				);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'cache-control': headers['cache-control'],
							'content-type': headers['content-type'],
							'set-cookie': headers['set-cookie']
						}
					};
				} else {
					console.log(data);
					return handleInitFlowError(data.id);
				}
			}
			case 'verification': {
				const { status, data, headers } =
					await auth.initializeSelfServiceVerificationFlowForBrowsers(returnTo);
				if (status === 200) {
					return {
						status,
						body: JSON.stringify(data),
						headers: {
							'cache-control': headers['cache-control'],
							'content-type': headers['content-type'],
							'set-cookie': headers['set-cookie']
						}
					};
				} else {
					console.log(data);
					return handleInitFlowError(data.id);
				}
			}
			default: {
				const error = 'Flow type does not exist';
				return {
					body: JSON.stringify(error),
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
		}
	} catch (error) {
		return {
			status: 500,
			body: JSON.stringify(error),
			headers: {
				'Content-Type': 'application/json'
			}
		};
	}
};

export const createLogoutUrl = async (cookie: string): Promise<RequestHandlerOutput> => {
	const { status, data, headers } = await auth.createSelfServiceLogoutFlowUrlForBrowsers(cookie);
	console.log('createLogoutUrl status');
	console.log(status);
	console.log('createLogoutUrl data');
	console.log(data);
	console.log('createLogoutUrl headers');
	console.log(headers);
	return {
		body: JSON.stringify(data),
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	}
}

export const submitLogoutFlow = async (token: string, returnTo?: string): Promise<RequestHandlerOutput> => {
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

export const getFlowError = async (error: string): Promise<RequestHandlerOutput> => {
	const { status, data } = await auth.getSelfServiceError(error);
	return {
		body: JSON.stringify(data),
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	};
};

export const getFlow = async (
	flowType: FlowType,
	flowId: string,
	cookie: string
): Promise<RequestHandlerOutput> => {
	try {
		cookie = decodeURIComponent(cookie);
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
				const error = 'Flow type does not exist';
				return {
					body: JSON.stringify(error),
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
		}
	} catch (err) {
		if (axios.isAxiosError(err)) {
			console.log('in catch of getFlow');
			console.log(err);
			if (err.response?.status === 400) {
				return {
					body: JSON.stringify(err.response?.data),
					status: err.response?.status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			} else if (err.response?.status === 403) {
				return {
					body: JSON.stringify(err.response?.data),
					status: err.response?.status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			} else if (err.response?.status === 410) {
				if (isSelfServiceFlowExpiredError(err.response.data)) {
					return {
						status: 410,
						headers: {
							Location: `/${flowType}?flow=${err.response.data.use_flow_id}`
						}
					};
				}
			}
		}
		return {
			body: JSON.stringify(err),
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	}
};

export const getSubmitSelfServiceLoginFlowBody = (
	formData: FormData
): {
	flowBody?: SubmitSelfServiceLoginFlowBody;
	error?: Error;
} => {
	const method = formData.get('method') ?? undefined;
	if (typeof method !== 'string') {
		return {
			error: new Error('No method attribute in post body')
		};
	}
	const csrf_token = formData.get('csrf_token') ?? undefined;
	if (method === 'oidc') {
		const provider = formData.get('provider') ?? undefined;
		if (typeof provider === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceLoginFlowWithOidcMethodBody = {
				csrf_token,
				provider,
				method
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	} else if (method === 'password') {
		const identifier = formData.get('identifier') ?? undefined;
		const password = formData.get('password') ?? undefined;
		if (
			typeof identifier === 'string' &&
			typeof password === 'string' &&
			typeof csrf_token === 'string'
		) {
			const flowBody: SubmitSelfServiceLoginFlowWithPasswordMethodBody = {
				csrf_token,
				identifier,
				password,
				method
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	}
	return {
		error: new Error('Login method not supported')
	};
};

export const getSubmitSelfServiceRecoveryFlowBody = (
	formData: FormData
): { flowBody?: SubmitSelfServiceRecoveryFlowBody; error?: Error } => {
	const method = formData.get('method') ?? undefined;
	if (typeof method !== 'string') {
		return {
			error: new Error('No method attribute in post body')
		};
	}
	if (method === 'link') {
		const email = formData.get('email') ?? undefined;
		const csrf_token = formData.get('csrf_token') ?? undefined;
		if (typeof email === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceRecoveryFlowWithLinkMethodBody = {
				csrf_token,
				email,
				method
			};
			return { flowBody };
		}
	}
	return {
		error: new Error('Recovery method not supported')
	};
};

export const getSubmitSelfServiceRegistrationFlowBody = (
	formData: FormData
): { flowBody?: SubmitSelfServiceRegistrationFlowBody; error?: Error } => {
	const method = formData.get('method') ?? undefined;
	if (typeof method !== 'string') {
		return {
			error: new Error('No method attribute in post body')
		};
	}
	const csrf_token = formData.get('csrf_token') ?? undefined;
	if (method === 'oidc') {
		const provider = formData.get('provider') ?? undefined;
		if (typeof provider === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceRegistrationFlowWithOidcMethodBody = {
				csrf_token,
				provider,
				method,
				traits: {
					email: formData.get('traits.email') ?? undefined,
					name: {
						first: formData.get('traits.name.first') ?? undefined
					}
				}
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	} else if (method === 'password') {
		const password = formData.get('password') ?? undefined;
		if (typeof password === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceRegistrationFlowWithPasswordMethodBody = {
				csrf_token,
				password,
				method,
				traits: {
					email: formData.get('traits.email'),
					name: {
						first: formData.get('traits.name.first')
					}
				}
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	}
	return {
		error: new Error('Registration method not supported')
	};
};

export const getSubmitSelfServiceSettingsFlowBody = (
	formData: FormData,
	flow?: string
): {
	flowBody?: SubmitSelfServiceSettingsFlowBody;
	error?: Error;
} => {
	const method = formData.get('method') ?? undefined;
	if (typeof method !== 'string') {
		return {
			error: new Error('No method attribute in post body')
		};
	}

	if (method === 'oidc') {
		const link = formData.get('link') ?? undefined;
		const unlink = formData.get('unlink') ?? undefined;
		if (typeof link === 'string') {
			if (typeof unlink === 'string') {
				const flowBody: SubmitSelfServiceSettingsFlowWithOidcMethodBody = {
					flow,
					link,
					method,
					unlink,
					traits: {
						email: formData.get('traits.email') ?? undefined,
						name: {
							first: formData.get('traits.name.first') ?? undefined
						}
					}
				};
				return { flowBody };
			}
			const flowBody: SubmitSelfServiceSettingsFlowWithOidcMethodBody = {
				flow,
				link,
				method,
				traits: {
					email: formData.get('traits.email') ?? undefined,
					name: {
						first: formData.get('traits.name.first') ?? undefined
					}
				}
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	} else if (method === 'password') {
		const password = formData.get('password') ?? undefined;
		const csrf_token = formData.get('csrf_token') ?? undefined;
		if (typeof password === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceSettingsFlowWithPasswordMethodBody = {
				csrf_token,
				password,
				method
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	} else if (method === 'profile') {
		const csrf_token = formData.get('csrf_token') ?? undefined;
		if (typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceSettingsFlowWithProfileMethodBody = {
				csrf_token,
				method,
				traits: {
					email: formData.get('traits.email') ?? undefined,
					name: {
						first: formData.get('traits.name.first') ?? undefined
					}
				}
			};
			return { flowBody };
		}
		return {
			error: new Error('Incorrect form data')
		};
	}
	return {
		error: new Error('Settings method not supported')
	};
};

export const getSubmitSelfServiceVerificationFlowBody = (
	formData: FormData
): { flowBody?: SubmitSelfServiceVerificationFlowBody; error?: Error } => {
	const method = formData.get('method') ?? undefined;
	if (typeof method !== 'string') {
		return {
			error: new Error('No method attribute in post body')
		};
	}
	if (method === 'link') {
		const email = formData.get('email') ?? undefined;
		const csrf_token = formData.get('csrf_token') ?? undefined;
		if (typeof email === 'string' && typeof csrf_token === 'string') {
			const flowBody: SubmitSelfServiceVerificationFlowWithLinkMethodBody = {
				csrf_token,
				email,
				method
			};
			return { flowBody };
		}
	}
	return {
		error: new Error('Verification method not supported')
	};
};

interface SelfServiceFlowExpiredError {
	error: GenericError;
	since: number;
	use_flow_id: string;
}

const isSelfServiceFlowExpiredError = (obj: unknown): obj is SelfServiceFlowExpiredError => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'error' in obj &&
		'since' in obj &&
		'use_flow_id' in obj
	);
};

export const postFlow = async (
	flowType: FlowType,
	flowId: string,
	cookie: string,
	formData: FormData
): Promise<RequestHandlerOutput> => {
	try {
		cookie = decodeURIComponent(cookie);
		switch (flowType) {
			case 'login': {
				const { flowBody, error } = getSubmitSelfServiceLoginFlowBody(formData);
				//console.log('csrf_token in body');
				//console.log(flowBody?.csrf_token);
				//console.log('csrf_token in cookie');
				//console.log(cookie);
				if (error) {
					console.log('Error creating Submit Login Flow Body');
					return {
						status: 400,
						body: JSON.stringify(error),
						headers: {
							'Content-Type': 'application/json'
						}
					};
				} else if (!flowBody) {
					const error = new Error('No post body');
					return {
						status: 400,
						body: JSON.stringify(error),
						headers: {
							'Content-Type': 'application/json'
						}
					};
				}
				const { status, data, headers } = await auth.submitSelfServiceLoginFlow(
					flowId,
					flowBody,
					undefined,
					cookie
				);

				console.log('Submit Self Service Login Flow Headers');
				console.log(headers);
				console.log('Submit Self Service Login Flow Data');
				console.log(data);
				console.log('Submit Self Serivce Login Flow Status');
				console.log(status);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'cache-control': headers['cache-control'],
						'content-type': headers['content-type'],
						'set-cookie': headers['set-cookie']
					}
				};
			}
			case 'recovery': {
				const { flowBody, error } = getSubmitSelfServiceRecoveryFlowBody(formData);
				if (error) {
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				} else if (!flowBody) {
					const error = new Error('No post body');
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				}

				const { status, data, headers } = await auth.submitSelfServiceRecoveryFlow(
					flowId,
					flowBody,
					undefined,
					cookie
				);

				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'cache-control': headers['cache-control'],
						'content-type': headers['content-type'],
						'set-cookie': headers['set-cookie']
					}
				};
			}
			case 'registration': {
				// TODO: Have to put traits object as input otherwise will fail
				const { flowBody, error } = getSubmitSelfServiceRegistrationFlowBody(formData);
				if (error) {
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				} else if (!flowBody) {
					const error = new Error('No post body');
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				}
				const { status, data, headers } = await auth.submitSelfServiceRegistrationFlow(
					flowId,
					flowBody,
					cookie
				);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'cache-control': headers['cache-control'],
						'content-type': headers['content-type'],
						'set-cookie': headers['set-cookie']
					}
				};
			}
			case 'settings': {
				const { flowBody, error } = getSubmitSelfServiceSettingsFlowBody(formData, flowId);
				if (error) {
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				} else if (!flowBody) {
					const error = new Error('No post body');
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				}
				const { status, data, headers } = await auth.submitSelfServiceSettingsFlow(
					flowId,
					flowBody,
					undefined,
					cookie
				);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'cache-control': headers['cache-control'],
						'content-type': headers['content-type'],
						'set-cookie': headers['set-cookie']
					}
				};
			}
			case 'verification': {
				const { flowBody, error } = getSubmitSelfServiceVerificationFlowBody(formData);
				if (error) {
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				} else if (!flowBody) {
					const error = new Error('No post body');
					return {
						status: 400,
						body: JSON.stringify(error)
					};
				}
				const { status, data, headers } = await auth.submitSelfServiceVerificationFlow(
					flowId,
					flowBody,
					undefined,
					cookie
				);
				return {
					body: JSON.stringify(data),
					status,
					headers: {
						'cache-control': headers['cache-control'],
						'content-type': headers['content-type'],
						'set-cookie': headers['set-cookie']
					}
				};
			}
			default: {
				const error = 'Flow type does not exist';
				return {
					body: JSON.stringify(error),
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			}
		}
	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.response?.status === 400) {
				return {
					body: JSON.stringify(err.response?.data),
					status: err.response?.status,
					headers: {
						'Content-Type': 'application/json'
					}
				};
			} else if (err.response?.status === 410) {
				if (isSelfServiceFlowExpiredError(err.response.data)) {
					return {
						status: 410,
						headers: {
							Location: `/${flowType}?flow=${err.response.data.use_flow_id}`
						}
					};
				}
			}
		}

		return {
			body: JSON.stringify(err),
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		};
	}
};
