import { error, redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { listBrands } from '$lib/server/brands/listBrands';
import { problemMessageOf } from '$lib/server/input/inputProblem';
import { rawInputOf } from '$lib/server/input/readInput';
import { readBrandDraft, takeOnBrand } from '$lib/server/brands/takeOnBrand';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

const badRequest = 400;
const forbidden = 403;
const seeOther = 303;

async function standingOf(locals: App.Locals) {
	const user = await requireUser(locals);
	const flags = await getProfileFlags(locals.supabase);
	return { accountId: user.id, isStaff: !flags.isRestricted && (flags.isStaff || flags.isAdmin) };
}

export const load: PageServerLoad = async ({ locals }) => {
	const standing = await standingOf(locals);
	return { brands: await listBrands(locals.supabase, standing), isStaff: standing.isStaff };
};

export const actions: Actions = {
	takeOn: async ({ locals, request }) => {
		const standing = await standingOf(locals);
		if (!standing.isStaff) error(forbidden, 'Only our staff take on brands.');
		let brandId: string;
		try {
			const draft = readBrandDraft(rawInputOf(await request.formData()));
			brandId = await takeOnBrand(locals.supabase, draft, standing.accountId);
		} catch (failure) {
			const problem = problemMessageOf(failure);
			if (problem === null) throw failure;
			return fail(badRequest, { problem });
		}
		redirect(seeOther, `/brands/${brandId}`);
	}
};
