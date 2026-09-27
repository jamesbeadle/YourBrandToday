import { error } from '@sveltejs/kit';
import { getContent, getContentReviews } from '$lib/server/content/getContent';
import { isUuid } from '$lib/data/isUuid';
import { moveContent, type ContentMove } from '$lib/server/content/moveContent';
import { readPublication, readSchedule } from '$lib/server/content/readContentMove';
import { readReview, reviewContent } from '$lib/server/content/reviewContent';
import { requireBrand, requireShaping } from '$lib/server/brands/requireBrand';
import { runFormCommand } from '$lib/server/http/formCommand';
import type { RawInput } from '$lib/server/input/readInput';
import type { Actions, PageServerLoad, RequestEvent } from './$types';

const notFound = 404;

export const load: PageServerLoad = async ({ locals, params }) => {
	const { brand } = await requireBrand(locals, params.brandId);
	const piece = isUuid(params.contentId) ? await getContent(locals.supabase, brand.id, params.contentId) : null;
	if (piece === null) error(notFound, 'There is no such piece on this brand.');
	return { piece, reviews: await getContentReviews(locals.supabase, piece.id) };
};

function moveAction(readMove: (input: RawInput) => ContentMove, message: string) {
	return async ({ locals, params, request }: RequestEvent) => {
		const visit = await requireShaping(locals, params.brandId);
		return runFormCommand(request, async (input) => {
			await moveContent(locals.supabase, visit.brand.id, params.contentId, readMove(input));
			return message;
		});
	};
}

export const actions: Actions = {
	review: async ({ locals, params, request }) => {
		const visit = await requireBrand(locals, params.brandId);
		const piece = await getContent(locals.supabase, visit.brand.id, params.contentId);
		if (piece === null) error(notFound, 'There is no such piece on this brand.');
		return runFormCommand(request, async (input) => {
			await reviewContent(locals.supabase, piece.id, readReview(input), visit.accountId);
			return 'Thank you — your review is recorded.';
		});
	},
	sendForApproval: moveAction(() => ({ to: 'awaiting_approval' }), 'Sent for approval.'),
	schedule: moveAction(readSchedule, 'Scheduled.'),
	publish: moveAction(readPublication, 'Recorded as published.')
};
