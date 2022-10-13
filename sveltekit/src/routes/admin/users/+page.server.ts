import type { User } from "$lib/entities";
import { error } from "@sveltejs/kit";
import type { Actions } from './$types';
import { CRUD_SERVICE_URL } from '$env/static/private';

export const actions: Actions = {
    CreateUser: async ({ request }) => {
        console.log('Inside Create User Function');
        const values = await request.formData();
        console.log('Got Request Values');
        const username = values.get("username");
        const email = values.get("email");
        const fullname = values.get("fullname");
        const birthmonth = values.get("birthmonth");
        const birthday = values.get("birthmonth");
        const birthyear = values.get("birthmonth");
        const gender = values.get("gender");

        if (
            typeof username !== 'string' ||
            typeof email !== 'string' ||
            typeof fullname !== 'string' ||
            typeof birthmonth !== 'string' ||
            typeof birthday !== 'string' ||
            typeof birthyear !== 'string' ||
            typeof gender !== 'string'
        ) {
            throw error(400, 'Bad form values');
        }

        const dateofbirth = new Date(`${birthyear}-${birthmonth}-${birthday}`)

        const user: User = {
            Username: username,
            Email: email,
            Fullname: fullname,
            Dateofbirth: dateofbirth.getTime().toString(),
            Gender: gender,
        }
        console.log('user: ', user);
        const res = await fetch(`${CRUD_SERVICE_URL}/users/v0`, {
            method: 'POST',
            body: JSON.stringify(user)
        });
        console.log(res);
        if (res.status === 200) {
            return {
                success: true,
                user: undefined,
                err: undefined
            }
        } else {
            const { err } : { err: object } = await res.json();
            return {
                success: false,
                user: undefined,
                err: err
            }
        }
    },
    GetUserByUsername: async ({ request }) => {
        const values = await request.formData();

        const username = values.get("username");

        if (typeof username !== 'string') {
            throw error(400, 'Bad form values');
        }

        const res = await fetch(`${CRUD_SERVICE_URL}/users/v0/username/${username}`);
        const { user, err } : {user: User, err: object} = await res.json();
        if (res.status === 200) {
            return {
                success: true,
                user: user,
                err: undefined
            }
        } else {
            return {
                success: false,
                user: undefined,
                err: err
            }
        }
    },
    GetUserByEmail: async ({ request }) => {
        const values = await request.formData();

        const email = values.get("email");

        if (typeof email !== 'string') {
            throw error(400, 'Bad form values');
        }

        const res = await fetch(`${CRUD_SERVICE_URL}/users/v0/email/${email}`);
        const { user, err } : {user: User, err: object} = await res.json();
        if (res.status === 200) {
            return {
                success: true,
                user: user,
                err: undefined
            }
        } else {
            return {
                success: false,
                user: undefined,
                err: err
            }
        }
    }
    
}