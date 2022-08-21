import { Configuration, V0alpha2Api } from "@ory/kratos-client";
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
	name: string;
	verified: boolean;
}