import { readMedium } from '$lib/server/input/readMedium';
import { readOptionalText, readRequiredText, type RawInput } from '$lib/server/input/readInput';
import { readWholeNumber } from '$lib/server/input/readNumbers';
import { readOptionalPublicUrl } from '$lib/server/input/readPublicUrl';
import type { SupabaseClient } from '@supabase/supabase-js';

const FitScore = { lowest: 0, highest: 100 } as const;
const TrendLimits = { title: 160, summary: 2000, rationale: 1000 } as const;

export type TrendDraft = {
	medium_path: string;
	title: string;
	summary: string;
	source_url: string;
	fit_score: number;
	fit_rationale: string;
};

export function readTrendDraft(input: RawInput): TrendDraft {
	return {
		medium_path: readMedium(input).path,
		title: readRequiredText(input, 'title', 'trend title', TrendLimits.title),
		summary: readOptionalText(input, 'summary', 'summary', TrendLimits.summary),
		source_url: readOptionalPublicUrl(input, 'sourceUrl', 'source link'),
		fit_score: readWholeNumber(input, 'fitScore', 'fit score', [FitScore.lowest, FitScore.highest]),
		fit_rationale: readOptionalText(input, 'fitRationale', 'fit rationale', TrendLimits.rationale)
	};
}

export async function recordTrend(
	supabase: SupabaseClient,
	brandId: string,
	draft: TrendDraft,
	accountId: string
): Promise<string> {
	const { data, error } = await supabase
		.from('trends')
		.insert({ ...draft, brand_id: brandId, recorded_by: accountId })
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}
