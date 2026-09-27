import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) {
		return { userEmail: null, isAdmin: false, isStaff: false };
	}
	const profileFlags = await getProfileFlags(locals.supabase);
	return {
		userEmail: user.email ?? '',
		isAdmin: profileFlags.isAdmin,
		isStaff: profileFlags.isAdmin || profileFlags.isStaff
	};
};
