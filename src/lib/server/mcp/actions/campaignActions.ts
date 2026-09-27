import { brandAction } from './brandAction';
import { campaignStatuses } from '$lib/work/campaign';
import { listCampaigns } from '$lib/server/campaigns/listCampaigns';
import { planCampaign, readCampaignDraft } from '$lib/server/campaigns/planCampaign';
import { putContentInCampaign, setCampaignStatus } from '$lib/server/campaigns/runCampaign';
import { readId, readOneOf } from '$lib/server/input/readInput';
import { textField, type McpAction } from '../actionTypes';

const penceInAPound = 100;

export const campaignActions: McpAction[] = [
	brandAction({
		name: 'plan_campaign',
		area: 'campaigns',
		isWrite: true,
		summary: 'plan a paid campaign towards an audience action, with a budget and dates',
		properties: {
			name: textField('The campaign name'),
			objective: textField('The audience action it pays for, such as follow, clickThrough or purchase'),
			budgetPounds: { type: 'number', description: 'The whole budget, in pounds' },
			startsOn: textField('YYYY-MM-DD'),
			endsOn: textField('YYYY-MM-DD')
		},
		required: ['name', 'objective', 'budgetPounds', 'startsOn', 'endsOn'],
		run: async ({ caller, brand }, input) =>
			`Planned (id ${await planCampaign(caller.supabase, brand.id, readCampaignDraft(input), caller.accountId)}).`
	}),
	brandAction({
		name: 'list_campaigns',
		area: 'campaigns',
		isWrite: false,
		summary: 'the brand’s campaigns and the pieces in each',
		properties: {},
		run: async ({ caller, brand }) => {
			const campaigns = await listCampaigns(caller.supabase, brand.id);
			if (campaigns.length === 0) return 'No campaigns yet.';
			return campaigns
				.map((campaign) => `- [${campaign.status}] ${campaign.name} (id ${campaign.id}) — ${campaign.objective}, £${campaign.budgetPence / penceInAPound}, ${campaign.startsOn} to ${campaign.endsOn}, ${campaign.contentIds.length} pieces`)
				.join('\n');
		}
	}),
	brandAction({
		name: 'add_content_to_campaign',
		area: 'campaigns',
		isWrite: true,
		summary: 'put a piece behind a campaign',
		properties: { campaignId: textField('The campaign id'), contentId: textField('The piece id') },
		required: ['campaignId', 'contentId'],
		run: async ({ caller, brand }, input) => {
			const campaignId = readId(input, 'campaignId', 'campaign');
			await putContentInCampaign(caller.supabase, brand.id, campaignId, readId(input, 'contentId', 'content'));
			return 'Added.';
		}
	}),
	brandAction({
		name: 'set_campaign_status',
		area: 'campaigns',
		isWrite: true,
		summary: 'mark a campaign planned, running, paused or ended',
		properties: { campaignId: textField('The campaign id'), status: textField(campaignStatuses.join(', ')) },
		required: ['campaignId', 'status'],
		run: async ({ caller, brand }, input) => {
			const status = readOneOf(input, 'status', 'status', campaignStatuses);
			await setCampaignStatus(caller.supabase, brand.id, readId(input, 'campaignId', 'campaign'), status);
			return `Now ${status}.`;
		}
	})
];
