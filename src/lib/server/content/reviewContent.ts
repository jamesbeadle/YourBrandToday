import { InputProblem } from '$lib/server/input/inputProblem';
import { readOneOf, readOptionalText, type RawInput } from '$lib/server/input/readInput';
import type { ContentStatus } from '$lib/work/contentPiece';
import type { SupabaseClient } from '@supabase/supabase-js';

export const reviewVerdicts = ['comment', 'changes_requested', 'approved'] as const;

type ReviewVerdict = (typeof reviewVerdicts)[number];

const reviewCharacters = 2000;

const statusAfter: Record<ReviewVerdict, ContentStatus | null> = {
	comment: null,
	changes_requested: 'drafted',
	approved: 'approved'
};

export function readReview(input: RawInput) {
	const verdict = readOneOf(input, 'verdict', 'verdict', reviewVerdicts);
	const body = readOptionalText(input, 'body', 'review', reviewCharacters);
	if (verdict !== 'approved' && body === '') throw new InputProblem('Say what you think.');
	return { verdict, body };
}

export async function reviewContent(
	supabase: SupabaseClient,
	contentId: string,
	review: ReturnType<typeof readReview>,
	accountId: string
): Promise<void> {
	const { error } = await supabase
		.from('content_reviews')
		.insert({ content_id: contentId, author_id: accountId, ...review });
	if (error) throw error;
	const nextStatus = statusAfter[review.verdict];
	if (nextStatus === null) return;
	const { error: updateError } = await supabase
		.from('content_pieces')
		.update({ status: nextStatus, updated_at: new Date().toISOString() })
		.eq('id', contentId);
	if (updateError) throw updateError;
}
