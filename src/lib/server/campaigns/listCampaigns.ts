import type { Campaign, CampaignStatus } from '$lib/work/campaign';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function listCampaigns(supabase: SupabaseClient, brandId: string): Promise<Campaign[]> {
	const { data, error } = await supabase
		.from('campaigns')
		.select('id, name, objective, budget_pence, starts_on, ends_on, status, campaign_pieces(content_id)')
		.eq('brand_id', brandId)
		.order('starts_on', { ascending: false });
	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		name: row.name,
		objective: row.objective,
		budgetPence: row.budget_pence,
		startsOn: row.starts_on,
		endsOn: row.ends_on,
		status: row.status as CampaignStatus,
		contentIds: (row.campaign_pieces ?? []).map((piece) => piece.content_id)
	}));
}
