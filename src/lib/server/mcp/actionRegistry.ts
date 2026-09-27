import { accountActions } from './actions/accountActions';
import { brandKitReadActions } from './actions/brandKitReadActions';
import { brandKitWriteActions } from './actions/brandKitWriteActions';
import { campaignActions } from './actions/campaignActions';
import { contentActions } from './actions/contentActions';
import { contentFlowActions } from './actions/contentFlowActions';
import { performanceActions } from './actions/performanceActions';
import { trendActions } from './actions/trendActions';
import type { ActionArea, McpAction } from './actionTypes';
import type { AccountStanding } from './resolveAccountStanding';

const everyAction: McpAction[] = [
	...accountActions,
	...brandKitReadActions,
	...brandKitWriteActions,
	...trendActions,
	...contentActions,
	...contentFlowActions,
	...campaignActions,
	...performanceActions
];

export function actionsFor(standing: AccountStanding, area: ActionArea | null): McpAction[] {
	return everyAction
		.filter((action) => action.audience === 'everyone' || standing.isStaff)
		.filter((action) => area === null || action.area === area)
		.sort((left, right) => left.name.localeCompare(right.name));
}

export function findAction(name: string, standing: AccountStanding): McpAction | null {
	return actionsFor(standing, null).find((action) => action.name === name) ?? null;
}

export function areasFor(standing: AccountStanding): ActionArea[] {
	return [...new Set(actionsFor(standing, null).map((action) => action.area))];
}
