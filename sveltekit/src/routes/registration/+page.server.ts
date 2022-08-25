import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { auth, modifyAction } from "$lib/auth";
import axios from 'axios';
import type { UiContainer } from "@ory/kratos-client";

export const load: PageServerLoad = async ({ parent, url, setHeaders, request }): Promise<{ ui: UiContainer, title: string}> => {
    try {
        const { user } = await parent();
        if (user) {
            throw redirect(307, '/');
        }
        
        const flowId = url.searchParams.get('flow') ?? undefined;
        const returnTo = url.searchParams.get('returnTo') ?? undefined;
        
        if (!flowId) {
            const { data, headers} = await auth.initializeSelfServiceRegistrationFlowForBrowsers(returnTo);
            
            const action = modifyAction('/registration', data.ui.action);
            if (action) {
                data.ui.action = action;
                return {
                    ui: data.ui,
                    title: 'Forefinder Registration'
                };
            }
            console.log('Err: No action in UiContainer in registration load');
            throw error(500, 'Error with registration page load');
        }
        
        let cookie = request.headers.get('cookie') ?? undefined;
        if (cookie) {
            cookie = decodeURIComponent(cookie);
        }
        const { data } = await auth.getSelfServiceRegistrationFlow(flowId, cookie);
        const action = modifyAction('/registration', data.ui.action);
        if (action) {
            data.ui.action = action;
            return {
                ui: data.ui,
                title: 'Forefinder Registration'
            };
        }
        console.log('Err: No action in UiContainer in registration load');
        throw error(500, 'Error with registration page load');
        
    } catch (err) {
        if (axios.isAxiosError(err)) {
			console.log(err);
			console.log('Registration error page status');
			console.log(err.response?.status);
			console.log('Registration error page data');
			console.log(err.response?.data);
            throw error(500, 'Registration load error');
		} else {
			console.log(err);
            throw error(500, 'Registration load error');
		}
    }	
};
