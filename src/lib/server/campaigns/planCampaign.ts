import { InputProblem } from '$lib/server/input/inputProblem';
import { isAudienceActionKey } from '$lib/brand/actions/actionCatalogue';
import { readIsoDate, readPounds } from '$lib/server/input/readNumbers';
import { readRequiredText, type RawInput } from '$lib/server/input/readInput';
import type { SupabaseClient } from '@supabase/supabase-js';

const nameCharacters = 120;

export function readCampaignDraft(input: RawInput) {
	const objective = String(input.objective ?? '').trim();
	if (!isAudienceActionKey(objective)) {
		throw new InputProblem('The objective is an audience action, such as follow, clickThrough or purchase.');
	}
	const draft = {
		name: readRequiredText(input, 'name', 'campaign name', nameCharacters),
		objective,
		budget_pence: readPounds(input, 'budgetPounds', 'budget'),
		starts_on: readIsoDate(input, 'startsOn', 'start date'),
		ends_on: readIsoDate(input, 'endsOn', 'end date')
	};
	if (draft.ends_on < draft.starts_on) throw new InputProblem('The campaign ends before it starts.');
	return draft;
}

export async function planCampaign(
	supabase: SupabaseClient,
	brandId: string,
	draft: ReturnType<typeof readCampaignDraft>,
	accountId: string
): Promise<string> {
	const { data, error } = await supabase
		.from('campaigns')
		.insert({ ...draft, brand_id: brandId, created_by: accountId })
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}
