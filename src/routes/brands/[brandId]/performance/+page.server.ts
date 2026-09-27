import { readIsoDate } from '$lib/server/input/readNumbers';
import { requireBrand } from '$lib/server/brands/requireBrand';
import { summarisePerformance, totalOf } from '$lib/server/performance/performanceSummary';
import type { PageServerLoad } from './$types';

const defaultDays = 28;
const millisecondsInADay = 86_400_000;

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	const since = sinceFrom(url.searchParams.get('since'));
	const byMedium = await summarisePerformance(locals.supabase, brand.id, since);
	return { since, byMedium, total: totalOf(byMedium) };
};

function sinceFrom(requested: string | null): string {
	const fallback = new Date(Date.now() - defaultDays * millisecondsInADay).toISOString().slice(0, 10);
	if (requested === null) return fallback;
	try {
		return readIsoDate({ since: requested }, 'since', 'since date');
	} catch {
		return fallback;
	}
}
