import { addBrandMember, readMembershipDraft } from '$lib/server/brands/addBrandMember';
import { brandOverviewOf } from '$lib/server/brands/brandOverview';
import { describeBrand, readBrandDraft } from '$lib/server/brands/takeOnBrand';
import { error } from '@sveltejs/kit';
import { getBrandMembers } from '$lib/server/brands/getBrand';
import { requireBrand, requireShaping } from '$lib/server/brands/requireBrand';
import { runFormCommand } from '$lib/server/http/formCommand';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { Actions, PageServerLoad } from './$types';

const forbidden = 403;

export const load: PageServerLoad = async ({ locals, params }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	const [overview, members] = await Promise.all([
		brandOverviewOf(locals.supabase, brand.id),
		getBrandMembers(supabaseServiceClient(), brand.id)
	]);
	return { overview, members };
};

export const actions: Actions = {
	describe: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await describeBrand(locals.supabase, visit.brand.id, readBrandDraft(input));
			return 'Saved.';
		});
	},
	addMember: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		if (visit.role !== 'staff') error(forbidden, 'Only our staff put people on a brand.');
		return runFormCommand(request, async (input) => {
			const draft = readMembershipDraft(input);
			await addBrandMember(supabaseServiceClient(), visit.brand.id, draft);
			return `${draft.email} is now ${draft.role}.`;
		});
	}
};
