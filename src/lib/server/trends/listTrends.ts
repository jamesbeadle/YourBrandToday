import type { SupabaseClient } from '@supabase/supabase-js';
import type { Trend, TrendStatus } from '$lib/work/trend';

const trendColumns =
	'id, medium_path, title, summary, source_url, fit_score, fit_rationale, status, observed_on';

export async function listTrends(
	supabase: SupabaseClient,
	brandId: string,
	status: TrendStatus | null
): Promise<Trend[]> {
	let query = supabase.from('trends').select(trendColumns).eq('brand_id', brandId);
	if (status !== null) query = query.eq('status', status);
	const { data, error } = await query.order('fit_score', { ascending: false }).limit(200);
	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		mediumPath: row.medium_path,
		title: row.title,
		summary: row.summary,
		sourceUrl: row.source_url,
		fitScore: row.fit_score,
		fitRationale: row.fit_rationale,
		status: row.status,
		observedOn: row.observed_on
	}));
}

export async function setTrendStatus(
	supabase: SupabaseClient,
	brandId: string,
	trendId: string,
	status: TrendStatus
): Promise<void> {
	const { error } = await supabase.from('trends').update({ status }).eq('brand_id', brandId).eq('id', trendId);
	if (error) throw error;
}
