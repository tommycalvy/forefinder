import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { AxiosError } from 'axios';
import { CRUD_SERVICE_URL } from '$env/static/private';
import { auth } from '$lib/auth';
import type { Profile } from '$lib/profile';

type CreateProfileResponse = {
	profile?: Profile;
	error?: object;
};

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user) {
		console.log('No user session. Redirecting to /login');
		throw redirect(307, '/login');
	}

	const res = await fetch(`${CRUD_SERVICE_URL}/profiles/v0/${user.id}/golf`);
	const { profile, error }: CreateProfileResponse = await res.json();
	if (error) {
		console.log('crud-service error: ', error);
	}
	return {
		user,
		profile,
		title: 'Profile - Golf - ForeFinder'
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		let cookie = request.headers.get('cookie') ?? undefined;
		if (cookie) {
			cookie = decodeURIComponent(cookie);
		} else {
			throw error(400, 'No session cookies present');
		}

		return await auth
			.toSession(undefined, cookie)
			.then(({ data: { identity } }) => {
				return identity.id;
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
					console.log('Unauthorized. No session. In profile/create/+server.ts');
					throw error(401, 'Unauthorized. This action requires authentication.');
				} else {
					console.log('Axios Error: ', err);
					throw error(400, 'Authentication Error');
				}
			})
			.then(async (id) => {
				const values = await request.formData();
				return {
					id: id,
					values: values
				};
			})
			.catch((err) => {
				console.log('Error getting form data: ', err);
				throw error(500, 'Error creating profile');
			})
			.then(({ id, values }) => {
				const profileID = values.get('id') ?? id; //TODO: For Testing ONLY. Change to only "id" in production.
				const name = values.get('name') ?? undefined;
				const date = Date.now();
				const status = values.get('status') ?? undefined;
				const avgScoreStr = values.get('avgScore') ?? undefined;
				const ageStr = values.get('age') ?? undefined;
				const genderStr = values.get('gender') ?? undefined;
				const bio = values.get('bio') ?? undefined;
				const playStyle = values.get('playStyle') ?? undefined;
				const pType = values.get('pType') ?? undefined;
				if (
					typeof profileID !== 'string' ||
					typeof pType !== 'string' ||
					typeof name !== 'string' ||
					typeof status !== 'string' ||
					typeof avgScoreStr !== 'string' ||
					typeof ageStr !== 'string' ||
					typeof genderStr !== 'string' ||
					typeof bio !== 'string' ||
					typeof playStyle !== 'string'
				) {
					throw error(400, 'Bad form values');
				}
				const avgScore = parseInt(avgScoreStr);
				const age = parseInt(ageStr);
				const gender = parseInt(genderStr);

				const profile: Profile = {
					ID: profileID,
					ProfileType: pType,
					Name: name,
					LastActive: date,
					Status: status,
					AverageScore: avgScore,
					Age: age,
					Gender: gender,
					Bio: bio,
					PlayStyle: playStyle
				};
				return fetch(`${CRUD_SERVICE_URL}/profiles/v0`, {
					method: 'POST',
					body: JSON.stringify(profile)
				});
			})
			.then((res) => {
				if (res.status === 200) {
					return {
						success: true
					};
				}
			})
			.catch((err) => {
				console.log('Error creating profile with crud-service: ', err);
				throw error(500, 'Error creating profile');
			});
	}
};

/*
export const POST: RequestHandler = async ({ request }) => {
	let cookie = request.headers.get('cookie') ?? undefined;
	if (cookie) {
		cookie = decodeURIComponent(cookie);
	} else {
		throw error(400, 'No session cookies present');
	}

	return await auth
		.toSession(undefined, cookie)
		.then(({ data: { identity } }) => {
			return identity.id;
		})
		.catch((err: AxiosError) => {
			if (err.response?.status === 401) {
				console.log('Unauthorized. No session. In profile/create/+server.ts');
				throw error(401, 'Unauthorized. This action requires authentication.');
			} else {
				console.log('Axios Error: ', err);
				throw error(400, 'Authentication Error');
			}
		})
		.then(async (id) => {
			const values = await request.formData();
			return {
				id: id,
				values: values
			};
		})
		.catch((err) => {
			console.log('Error getting form data: ', err);
			throw error(500, 'Error creating profile');
		})
		.then(({ id, values }) => {
			const profileID = values.get('id') ?? id; //TODO: For Testing ONLY. Change to only "id" in production.
			const name = values.get('name') ?? undefined;
			const date = Date.now();
			const status = values.get('status') ?? undefined;
			const avgScoreStr = values.get('avgScore') ?? undefined;
			const ageStr = values.get('age') ?? undefined;
			const genderStr = values.get('gender') ?? undefined;
			const bio = values.get('bio') ?? undefined;
			const playStyleStr = values.get('playStyle') ?? undefined;
			const pType = values.get('pType') ?? undefined;
			if (
				typeof profileID !== 'string' ||
				typeof pType !== 'string' ||
				typeof name !== 'string' ||
				typeof status !== 'string' ||
				typeof avgScoreStr !== 'string' ||
				typeof ageStr !== 'string' ||
				typeof genderStr !== 'string' ||
				typeof bio !== 'string' ||
				typeof playStyleStr !== 'string'
			) {
				throw error(400, 'Bad form values');
			}
			const avgScore = parseInt(avgScoreStr);
			const age = parseInt(ageStr);
			const gender = parseInt(genderStr);
			const playStyle = parseInt(playStyleStr);

			const profile: Profile = {
				ID: profileID,
				ProfileType: pType,
				Name: name,
				LastActive: date,
				Status: status,
				AverageScore: avgScore,
				Age: age,
				Gender: gender,
				Bio: bio,
				PlayStyle: playStyle
			};
			return fetch(`${CRUD_SERVICE_URL}/profiles/v0`, {
				method: 'POST',
				body: JSON.stringify(profile)
			});
		})
		.catch((err) => {
			console.log('Error creating profile with crud-service: ', err);
			throw error(500, 'Error creating profile');
		});
};
*/
