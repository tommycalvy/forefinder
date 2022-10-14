import type { User } from "$lib/entities";
import { error } from "@sveltejs/kit";
import type { Actions } from './$types';
import { CRUD_SERVICE_URL } from '$env/static/private';

export const actions: Actions = {
    createuser: async ({ request }) => {
        console.log('Inside Create User Function');
        
        const values = await request.formData();
        console.log('Got Request Values');
        const email = values.get("email");
        const username = values.get("username");
        const fullname = values.get("fullname");
        const birthmonth = values.get("birthmonth");
        const birthday = values.get("birthday");
        const birthyear = values.get("birthyear");
        const gender = values.get("gender");
        
        /*
        const email = 'thomaslcalvy@gmail.com';
        const username = 'Tomminator3';
        const fullname = 'Tommy Calvy'
        const birthmonth = '11';
        const birthday = '19';
        const birthyear = '1997';
        const gender = '1';
        */

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
        console.log(`${birthyear}-${birthmonth}-${birthday}`);
        const dateofbirth = new Date(`${birthyear}-${birthmonth}-${birthday}`);
        //const dateofbirth = new Date(birthyear + '-' + birthmonth + '-' + birthday);
        console.log(dateofbirth);

        const user: User = {
            Username: username,
            Email: email,
            Fullname: fullname,
            Dateofbirth: dateofbirth.getTime().toString(),
            Gender: gender,
        }
        console.log(JSON.stringify(user));
        
        const res = await fetch(`${CRUD_SERVICE_URL}/users/v0/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({"User": user}),
        });
        const { err } : { err: object } = await res.json();
        console.log(err);
        if (res.ok) {
            return {
                action: 'createuser',
                success: true,
                user: undefined,
                err: undefined,
            }
        } else {
            return {
                action: 'createuser',
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
                action: 'getuserbyusername',
                success: true,
                user: user,
                err: undefined
            }
        } else {
            return {
                action: 'getuserbyusername',
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
                action: 'getuserbyemail',
                success: true,
                user: user,
                err: undefined
            }
        } else {
            return {
                action: 'getuserbyemail',
                success: false,
                user: undefined,
                err: err
            }
        }
    }
    
}