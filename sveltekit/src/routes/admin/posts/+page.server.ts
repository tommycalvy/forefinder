import { error } from "@sveltejs/kit";
import type { Actions } from './$types';
import { CRUD_SERVICE_URL } from '$env/static/private';

export const actions: Actions = {
    CreatePost: async ({ request }) => {
        return {

        }
    },
    GetPostsByUsername: async ({ request }) => {
        return {

        }
    },
    GetPostsByGeo: async ({ request }) => {
        return {
            
        }
    }   
}