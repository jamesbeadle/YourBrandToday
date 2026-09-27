import { brandAction } from './brandAction';
import { moveContent } from '$lib/server/content/moveContent';
import { readId } from '$lib/server/input/readInput';
import { readPublication, readSchedule } from '$lib/server/content/readContentMove';
import { readReview, reviewContent } from '$lib/server/content/reviewContent';
import { assertOnBrand } from '$lib/server/brands/assertOnBrand';
import { textField, type McpAction } from '../actionTypes';

const contentIdField = { contentId: textField('The piece id') };

export const contentFlowActions: McpAction[] = [
	brandAction({
		name: 'send_content_for_approval',
		area: 'content',
		isWrite: true,
		summary: 'send a drafted piece to the brand’s owner to approve',
		properties: contentIdField,
		required: ['contentId'],
		run: async ({ caller, brand }, input) => {
			await moveContent(caller.supabase, brand.id, readId(input, 'contentId', 'content'), { to: 'awaiting_approval' });
			return 'Sent for approval.';
		}
	}),
	brandAction({
		name: 'review_content',
		area: 'content',
		isWrite: true,
		isOpenToViewers: true,
		summary: 'approve a piece, ask for changes, or comment — anyone on the brand',
		properties: { ...contentIdField, verdict: textField('approved, changes_requested or comment'), body: textField('What you think') },
		required: ['contentId', 'verdict'],
		run: async ({ caller, brand }, input) => {
			const contentId = readId(input, 'contentId', 'content');
			await assertOnBrand(caller.supabase, 'content_pieces', brand.id, contentId);
			await reviewContent(caller.supabase, contentId, readReview(input), caller.accountId);
			return 'Review recorded.';
		}
	}),
	brandAction({
		name: 'schedule_content',
		area: 'content',
		isWrite: true,
		summary: 'schedule an approved piece to publish',
		properties: { ...contentIdField, scheduledFor: textField('When, as an ISO date and time') },
		required: ['contentId', 'scheduledFor'],
		run: async ({ caller, brand }, input) => {
			await moveContent(caller.supabase, brand.id, readId(input, 'contentId', 'content'), readSchedule(input));
			return 'Scheduled.';
		}
	}),
	brandAction({
		name: 'record_publication',
		area: 'content',
		isWrite: true,
		summary: 'record that a piece went out, and where',
		properties: { ...contentIdField, publishedUrl: textField('The public link to it') },
		required: ['contentId', 'publishedUrl'],
		run: async ({ caller, brand }, input) => {
			await moveContent(caller.supabase, brand.id, readId(input, 'contentId', 'content'), readPublication(input));
			return 'Recorded as published.';
		}
	})
];
