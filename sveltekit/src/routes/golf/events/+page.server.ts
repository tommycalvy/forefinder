import type { User } from "$lib/auth";
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async({ parent }): Promise<{ user: User | undefined, title: string }> => {
    const { user } = await parent();
    return {
        user,
        title: 'Events - Golf - ForeFinder'
    }
}