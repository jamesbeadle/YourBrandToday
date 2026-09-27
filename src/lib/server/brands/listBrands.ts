import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrandReach } from './brandRole';

export type BrandSummary = { id: string; name: string; summary: string; role: string };

export async function listBrands(supabase: SupabaseClient, reach: BrandReach): Promise<BrandSummary[]> {
	if (reach.isStaff) return listEveryBrand(supabase);
	const { data, error } = await supabase
		.from('brand_members')
		.select('role, brands(id, name, summary)')
		.eq('account_id', reach.accountId);
	if (error) throw error;
	return (data ?? []).map((row) => {
		const brand = row.brands as unknown as { id: string; name: string; summary: string };
		return { ...brand, role: row.role };
	});
}

async function listEveryBrand(supabase: SupabaseClient): Promise<BrandSummary[]> {
	const { data, error } = await supabase.from('brands').select('id, name, summary').order('name');
	if (error) throw error;
	return (data ?? []).map((brand) => ({ ...brand, role: 'staff' }));
}
