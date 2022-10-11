import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (): Promise<{community: string }> => {
    return {
        community: 'Golf'
    }
}
