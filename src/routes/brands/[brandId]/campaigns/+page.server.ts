import { campaignStatuses } from '$lib/work/campaign';
import { listCampaigns } from '$lib/server/campaigns/listCampaigns';
import { listContent } from '$lib/server/content/listContent';
import { planCampaign, readCampaignDraft } from '$lib/server/campaigns/planCampaign';
import { putContentInCampaign, setCampaignStatus } from '$lib/server/campaigns/runCampaign';
import { readId, readOneOf } from '$lib/server/input/readInput';
import { requireBrand, requireShaping } from '$lib/server/brands/requireBrand';
import { runFormCommand } from '$lib/server/http/formCommand';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	const [campaigns, pieces] = await Promise.all([
		listCampaigns(locals.supabase, brand.id),
		listContent(locals.supabase, brand.id, null)
	]);
	return { campaigns, pieces };
};

export const actions: Actions = {
	plan: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await planCampaign(locals.supabase, visit.brand.id, readCampaignDraft(input), visit.accountId);
			return 'Campaign planned.';
		});
	},
	setStatus: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			const status = readOneOf(input, 'status', 'status', campaignStatuses);
			await setCampaignStatus(locals.supabase, visit.brand.id, readId(input, 'campaignId', 'campaign'), status);
			return `Now ${status}.`;
		});
	},
	addPiece: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			const campaignId = readId(input, 'campaignId', 'campaign');
			await putContentInCampaign(locals.supabase, visit.brand.id, campaignId, readId(input, 'contentId', 'content'));
			return 'Added to the campaign.';
		});
	}
};
