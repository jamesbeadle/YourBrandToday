import type { SupabaseClient } from '@supabase/supabase-js';

export type AccountStanding = {
	accountId: string;
	email: string;
	isStaff: boolean;
	isAdmin: boolean;
	isRestricted: boolean;
};

export async function resolveAccountStanding(
	supabase: SupabaseClient,
	accountId: string
): Promise<AccountStanding> {
	const { data, error } = await supabase
		.from('profiles')
		.select('email, is_staff, is_admin, is_restricted')
		.eq('id', accountId)
		.maybeSingle();
	if (error) throw error;
	const isRestricted = data?.is_restricted !== false;
	const isAdmin = !isRestricted && data?.is_admin === true;
	return {
		accountId,
		email: data?.email ?? '',
		isStaff: isAdmin || (!isRestricted && data?.is_staff === true),
		isAdmin,
		isRestricted
	};
}
