import { fail, redirect } from '@sveltejs/kit';
import { getDisplayName } from '$lib/server/auth/getDisplayName';
import { requireUser } from '$lib/server/auth/requireUser';
import { saveDisplayName } from '$lib/server/auth/saveDisplayName';
import type { Actions, PageServerLoad } from './$types';

const badRequestStatus = 400;
const displayNameLimit = 60;

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return { displayName: await getDisplayName(locals.supabase) };
};

export const actions: Actions = {
	signOut: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		redirect(303, '/');
	},
	saveDisplayName: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const displayName = String(formData.get('displayName') ?? '').trim();
		if (displayName.length > displayNameLimit) {
			return fail(badRequestStatus, {
				message: `Display names are ${displayNameLimit} characters at most.`
			});
		}
		await saveDisplayName(locals.supabase, displayName);
		return { message: 'Profile saved.' };
	}
};
