import { readCount, readIsoDate, readPounds } from '$lib/server/input/readNumbers';
import { readMedium } from '$lib/server/input/readMedium';
import { readOptionalId, type RawInput } from '$lib/server/input/readInput';
import { assertOnBrand } from '$lib/server/brands/assertOnBrand';
import type { SupabaseClient } from '@supabase/supabase-js';

export const countedFigures = [
	'views',
	'watchSeconds',
	'likes',
	'comments',
	'shares',
	'saves',
	'clicks',
	'conversions'
] as const;

const columnOf: Record<(typeof countedFigures)[number], string> = {
	views: 'views',
	watchSeconds: 'watch_seconds',
	likes: 'likes',
	comments: 'comments',
	shares: 'shares',
	saves: 'saves',
	clicks: 'clicks',
	conversions: 'conversions'
};

export function readReading(input: RawInput): Record<string, unknown> {
	const counts = countedFigures.map((figure) => [columnOf[figure], readCount(input, figure, figure)]);
	const hasSpend = input.spendPounds !== undefined && String(input.spendPounds).trim() !== '';
	return {
		...Object.fromEntries(counts),
		medium_path: readMedium(input).path,
		observed_on: readIsoDate(input, 'observedOn', 'date observed'),
		content_id: readOptionalId(input, 'contentId', 'content'),
		campaign_id: readOptionalId(input, 'campaignId', 'campaign'),
		spend_pence: hasSpend ? readPounds(input, 'spendPounds', 'spend') : 0
	};
}

export async function recordReading(
	supabase: SupabaseClient,
	brandId: string,
	reading: Record<string, unknown>,
	accountId: string
): Promise<void> {
	await assertOnBrand(supabase, 'content_pieces', brandId, reading.content_id as string | null);
	await assertOnBrand(supabase, 'campaigns', brandId, reading.campaign_id as string | null);
	const { error } = await supabase
		.from('performance_readings')
		.insert({ ...reading, brand_id: brandId, recorded_by: accountId });
	if (error) throw error;
}
