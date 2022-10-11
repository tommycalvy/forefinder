import type { User } from "$lib/auth";
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async({ parent }): Promise<{ user: User | undefined, pageTitle: string, localTitle: string }> => {
    const { user } = await parent();
    return {
        user,
        pageTitle: 'Friends - Golf - ForeFinder',
        localTitle: 'Friends'
    }
}