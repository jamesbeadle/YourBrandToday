import { InputProblem } from '$lib/server/input/inputProblem';
import type { SupabaseClient } from '@supabase/supabase-js';

type BrandOwnedTable = 'trends' | 'content_pieces' | 'campaigns';

const nameOf: Record<BrandOwnedTable, string> = {
	trends: 'trend',
	content_pieces: 'piece',
	campaigns: 'campaign'
};

export async function assertOnBrand(
	supabase: SupabaseClient,
	table: BrandOwnedTable,
	brandId: string,
	id: string | null
): Promise<void> {
	if (id === null) return;
	const { data, error } = await supabase.from(table).select('id').eq('brand_id', brandId).eq('id', id).maybeSingle();
	if (error) throw error;
	if (data === null) throw new InputProblem(`That ${nameOf[table]} is not on this brand.`);
}
