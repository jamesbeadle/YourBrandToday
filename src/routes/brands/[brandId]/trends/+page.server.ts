import { listTrends, setTrendStatus } from '$lib/server/trends/listTrends';
import { readId, readOneOf } from '$lib/server/input/readInput';
import { readTrendDraft, recordTrend } from '$lib/server/trends/recordTrend';
import { requireBrand, requireShaping } from '$lib/server/brands/requireBrand';
import { runFormCommand } from '$lib/server/http/formCommand';
import { trendStatuses } from '$lib/work/trend';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	return { trends: await listTrends(locals.supabase, brand.id, null) };
};

export const actions: Actions = {
	record: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await recordTrend(locals.supabase, visit.brand.id, readTrendDraft(input), visit.accountId);
			return 'Trend recorded.';
		});
	},
	setStatus: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			const status = readOneOf(input, 'status', 'status', trendStatuses);
			await setTrendStatus(locals.supabase, visit.brand.id, readId(input, 'trendId', 'trend'), status);
			return `Now ${status}.`;
		});
	}
};
