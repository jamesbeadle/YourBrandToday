import { everywherePath } from '$lib/brand/mediums/mediumDefinition';
import { facets } from '$lib/brand/facets';
import { findMedium } from '$lib/brand/mediums/mediumCatalogue';
import { resolveBrandFor } from './resolveBrandFor';
import type { Medium } from '$lib/brand/mediums/mediumDefinition';
import type { SupabaseClient } from '@supabase/supabase-js';

export type FacetCompleteness = { label: string; decided: number; possible: number };

export type BrandOverview = {
	completeness: FacetCompleteness[];
	proposals: number;
	trendsWatching: number;
	awaitingApproval: number;
	runningCampaigns: number;
};

export async function brandOverviewOf(supabase: SupabaseClient, brandId: string): Promise<BrandOverview> {
	const resolved = await resolveBrandFor(supabase, brandId, findMedium(everywherePath) as Medium);
	const completeness = facets.map((facet) => ({
		label: facet.label,
		decided: resolved.traits.filter((trait) => trait.trait.facet === facet.key).length,
		possible:
			resolved.traits.filter((trait) => trait.trait.facet === facet.key).length +
			resolved.gaps.filter((trait) => trait.facet === facet.key).length
	}));
	const [proposals, trendsWatching, awaitingApproval, runningCampaigns] = await Promise.all([
		countOf(supabase, 'brand_decisions', brandId, 'proposed'),
		countOf(supabase, 'trends', brandId, 'watching'),
		countOf(supabase, 'content_pieces', brandId, 'awaiting_approval'),
		countOf(supabase, 'campaigns', brandId, 'running')
	]);
	return { completeness, proposals, trendsWatching, awaitingApproval, runningCampaigns };
}

async function countOf(supabase: SupabaseClient, table: string, brandId: string, status: string): Promise<number> {
	const { count, error } = await supabase
		.from(table)
		.select('id', { count: 'exact', head: true })
		.eq('brand_id', brandId)
		.eq('status', status);
	if (error) throw error;
	return count ?? 0;
}
