import { changeDecisionStatus } from '$lib/server/brands/changeDecisionStatus';
import { cssVariablesOf } from '$lib/brand/projections/cssVariables';
import { decisionSourceFor } from '$lib/server/brands/brandRole';
import { everywherePath } from '$lib/brand/mediums/mediumDefinition';
import { findMedium } from '$lib/brand/mediums/mediumCatalogue';
import { loadBrandModel } from '$lib/server/brands/loadBrandModel';
import { readDecisionForm } from '$lib/server/brands/readDecisionForm';
import { readId } from '$lib/server/input/readInput';
import { recordDecision } from '$lib/server/brands/recordDecision';
import { requireBrand, requireShaping } from '$lib/server/brands/requireBrand';
import { resolveBrand } from '$lib/brand/resolution/resolveBrand';
import { runFormCommand } from '$lib/server/http/formCommand';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	const medium = findMedium(url.searchParams.get('medium') ?? '') ?? findMedium(everywherePath)!;
	const model = await loadBrandModel(locals.supabase, brand.id);
	const resolved = resolveBrand(model.decisions, model.catalogue, medium);
	return {
		medium,
		resolved,
		variables: cssVariablesOf(resolved),
		catalogue: model.catalogue,
		proposals: model.decisions.filter((decision) => decision.status === 'proposed')
	};
};

export const actions: Actions = {
	decide: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			const { catalogue } = await loadBrandModel(locals.supabase, visit.brand.id);
			const recording = {
				...readDecisionForm(input, catalogue),
				brandId: visit.brand.id,
				source: decisionSourceFor(visit.role),
				status: 'adopted' as const,
				accountId: visit.accountId
			};
			await recordDecision(locals.supabase, recording, catalogue);
			return 'Decided.';
		});
	},
	adopt: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await changeDecisionStatus(locals.supabase, visit.brand.id, readId(input, 'decisionId', 'decision'), 'adopt');
			return 'Adopted.';
		});
	},
	retire: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await changeDecisionStatus(locals.supabase, visit.brand.id, readId(input, 'decisionId', 'decision'), 'retire');
			return 'Retired — the medium above holds again.';
		});
	}
};
