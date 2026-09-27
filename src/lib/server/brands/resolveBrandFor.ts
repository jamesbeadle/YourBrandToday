import { loadBrandModel } from './loadBrandModel';
import { resolveBrand } from '$lib/brand/resolution/resolveBrand';
import type { Medium } from '$lib/brand/mediums/mediumDefinition';
import type { ResolvedBrand } from '$lib/brand/resolution/resolvedBrand';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function resolveBrandFor(
	supabase: SupabaseClient,
	brandId: string,
	medium: Medium
): Promise<ResolvedBrand> {
	const model = await loadBrandModel(supabase, brandId);
	return resolveBrand(model.decisions, model.catalogue, medium);
}
