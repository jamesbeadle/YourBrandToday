import type { SupabaseClient } from '@supabase/supabase-js';

export type BrandMember = { accountId: string; email: string; role: string };

export type Brand = { id: string; name: string; summary: string };

export async function getBrand(supabase: SupabaseClient, brandId: string): Promise<Brand | null> {
	const { data, error } = await supabase
		.from('brands')
		.select('id, name, summary')
		.eq('id', brandId)
		.maybeSingle();
	if (error) throw error;
	return data;
}

export async function getBrandMembers(serviceClient: SupabaseClient, brandId: string): Promise<BrandMember[]> {
	const { data, error } = await serviceClient
		.from('brand_members')
		.select('account_id, role')
		.eq('brand_id', brandId);
	if (error) throw error;
	const accountIds = (data ?? []).map((row) => row.account_id);
	const emails = await emailsOf(serviceClient, accountIds);
	return (data ?? []).map((row) => ({
		accountId: row.account_id,
		email: emails.get(row.account_id) ?? '',
		role: row.role
	}));
}

async function emailsOf(serviceClient: SupabaseClient, accountIds: string[]): Promise<Map<string, string>> {
	const { data, error } = await serviceClient.from('profiles').select('id, email').in('id', accountIds);
	if (error) throw error;
	return new Map((data ?? []).map((profile) => [profile.id, profile.email]));
}
