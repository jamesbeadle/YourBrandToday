import { draftContent, readContentDraft } from '$lib/server/content/draftContent';
import { listContent } from '$lib/server/content/listContent';
import { requireBrand, requireShaping } from '$lib/server/brands/requireBrand';
import { runFormCommand } from '$lib/server/http/formCommand';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	return { pieces: await listContent(locals.supabase, brand.id, null) };
};

export const actions: Actions = {
	draft: async ({ locals, params, request }) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await draftContent(locals.supabase, visit.brand, readContentDraft(input), visit.accountId);
			return 'Drafted.';
		});
	}
};
