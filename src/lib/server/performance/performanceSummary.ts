import type { SupabaseClient } from '@supabase/supabase-js';

export type PerformanceTotals = {
	views: number;
	watchSeconds: number;
	engagements: number;
	clicks: number;
	conversions: number;
	spendPence: number;
};

export type MediumPerformance = PerformanceTotals & { mediumPath: string };

type ReadingRow = Record<string, number | string>;

const readingColumns =
	'medium_path, views, watch_seconds, likes, comments, shares, saves, clicks, conversions, spend_pence';

export async function summarisePerformance(
	supabase: SupabaseClient,
	brandId: string,
	sinceIsoDate: string
): Promise<MediumPerformance[]> {
	const { data, error } = await supabase
		.from('performance_readings')
		.select(readingColumns)
		.eq('brand_id', brandId)
		.gte('observed_on', sinceIsoDate);
	if (error) throw error;
	const byMedium = new Map<string, MediumPerformance>();
	for (const row of (data ?? []) as ReadingRow[]) {
		const mediumPath = String(row.medium_path);
		byMedium.set(mediumPath, addReading(byMedium.get(mediumPath) ?? emptyTotals(mediumPath), row));
	}
	return [...byMedium.values()].sort((left, right) => right.views - left.views);
}

export function totalOf(rows: MediumPerformance[]): PerformanceTotals {
	return rows.reduce((total, row) => addTotals(total, row), emptyTotals('all'));
}

function addReading(totals: MediumPerformance, row: ReadingRow): MediumPerformance {
	const engagements = ['likes', 'comments', 'shares', 'saves'].reduce((sum, column) => sum + Number(row[column]), 0);
	return {
		...totals,
		views: totals.views + Number(row.views),
		watchSeconds: totals.watchSeconds + Number(row.watch_seconds),
		engagements: totals.engagements + engagements,
		clicks: totals.clicks + Number(row.clicks),
		conversions: totals.conversions + Number(row.conversions),
		spendPence: totals.spendPence + Number(row.spend_pence)
	};
}

function addTotals<Totals extends PerformanceTotals>(totals: Totals, extra: PerformanceTotals): Totals {
	return {
		...totals,
		views: totals.views + extra.views,
		watchSeconds: totals.watchSeconds + extra.watchSeconds,
		engagements: totals.engagements + extra.engagements,
		clicks: totals.clicks + extra.clicks,
		conversions: totals.conversions + extra.conversions,
		spendPence: totals.spendPence + extra.spendPence
	};
}

function emptyTotals(mediumPath: string): MediumPerformance {
	return { mediumPath, views: 0, watchSeconds: 0, engagements: 0, clicks: 0, conversions: 0, spendPence: 0 };
}
