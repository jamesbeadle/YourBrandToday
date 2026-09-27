export const campaignStatuses = ['planned', 'running', 'paused', 'ended'] as const;

export type CampaignStatus = (typeof campaignStatuses)[number];

export type Campaign = {
	id: string;
	name: string;
	objective: string;
	budgetPence: number;
	startsOn: string;
	endsOn: string;
	status: CampaignStatus;
	contentIds: string[];
};
