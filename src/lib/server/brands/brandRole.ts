import type { SupabaseClient } from '@supabase/supabase-js';

export const memberRoles = ['owner', 'manager', 'viewer'] as const;

export type MemberRole = (typeof memberRoles)[number];

export type BrandRole = MemberRole | 'staff';

export type BrandReach = { accountId: string; isStaff: boolean };

export async function brandRoleFor(
	supabase: SupabaseClient,
	reach: BrandReach,
	brandId: string
): Promise<BrandRole | null> {
	if (reach.isStaff) return 'staff';
	const { data, error } = await supabase
		.from('brand_members')
		.select('role')
		.eq('brand_id', brandId)
		.eq('account_id', reach.accountId)
		.maybeSingle();
	if (error) throw error;
	return (data?.role as MemberRole | undefined) ?? null;
}

export function canShapeBrand(role: BrandRole | null): boolean {
	return role === 'staff' || role === 'owner' || role === 'manager';
}

export function decisionSourceFor(role: BrandRole): 'staff' | 'client' {
	if (role === 'staff' || role === 'manager') return 'staff';
	return 'client';
}
