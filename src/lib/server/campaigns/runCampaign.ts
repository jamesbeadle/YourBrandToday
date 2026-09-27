import { InputProblem } from '$lib/server/input/inputProblem';
import type { CampaignStatus } from '$lib/work/campaign';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function setCampaignStatus(
	supabase: SupabaseClient,
	brandId: string,
	campaignId: string,
	status: CampaignStatus
): Promise<void> {
	const { data, error } = await supabase
		.from('campaigns')
		.update({ status })
		.eq('brand_id', brandId)
		.eq('id', campaignId)
		.select('id');
	if (error) throw error;
	if ((data ?? []).length === 0) throw new InputProblem('That campaign is not on this brand.');
}

export async function putContentInCampaign(
	supabase: SupabaseClient,
	brandId: string,
	campaignId: string,
	contentId: string
): Promise<void> {
	const [campaign, content] = await Promise.all([
		supabase.from('campaigns').select('id').eq('brand_id', brandId).eq('id', campaignId).maybeSingle(),
		supabase.from('content_pieces').select('id').eq('brand_id', brandId).eq('id', contentId).maybeSingle()
	]);
	if (campaign.error) throw campaign.error;
	if (content.error) throw content.error;
	if (campaign.data === null || content.data === null) {
		throw new InputProblem('Both the campaign and the piece must be on this brand.');
	}
	const { error } = await supabase
		.from('campaign_pieces')
		.upsert({ campaign_id: campaignId, content_id: contentId });
	if (error) throw error;
}
