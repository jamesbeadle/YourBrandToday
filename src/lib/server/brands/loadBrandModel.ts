import { catalogueWith } from '$lib/brand/traits/traitCatalogue';
import type { Decision } from '$lib/brand/decisions/decision';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TraitDefinition } from '$lib/brand/traits/traitDefinition';

export type BrandModel = { catalogue: TraitDefinition[]; decisions: Decision[] };

const decisionColumns = 'id, trait_key, medium_path, value, rationale, source, status, created_at';

export async function loadBrandModel(supabase: SupabaseClient, brandId: string): Promise<BrandModel> {
	const [customTraits, decisions] = await Promise.all([
		loadCustomTraits(supabase, brandId),
		loadDecisions(supabase, brandId)
	]);
	return { catalogue: catalogueWith(customTraits), decisions };
}

async function loadCustomTraits(supabase: SupabaseClient, brandId: string): Promise<TraitDefinition[]> {
	const { data, error } = await supabase
		.from('brand_traits')
		.select('key, facet, kind, label, purpose, choices')
		.eq('brand_id', brandId);
	if (error) throw error;
	return (data ?? []).map((row) => ({ ...row, isCustom: true }));
}

async function loadDecisions(supabase: SupabaseClient, brandId: string): Promise<Decision[]> {
	const { data, error } = await supabase
		.from('brand_decisions')
		.select(decisionColumns)
		.eq('brand_id', brandId)
		.neq('status', 'retired')
		.order('created_at');
	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		traitKey: row.trait_key,
		mediumPath: row.medium_path,
		value: row.value,
		rationale: row.rationale,
		source: row.source,
		status: row.status,
		decidedAt: row.created_at
	}));
}
