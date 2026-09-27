import { brandAction } from './brandAction';
import { contentStatuses } from '$lib/work/contentPiece';
import { describeContentPiece } from './describeContentPiece';
import { draftContent, readContentDraft } from '$lib/server/content/draftContent';
import { getContent, getContentReviews } from '$lib/server/content/getContent';
import { InputProblem } from '$lib/server/input/inputProblem';
import { listContent } from '$lib/server/content/listContent';
import { mediumField } from './brandKitReadActions';
import { readId, readOneOf } from '$lib/server/input/readInput';
import { textField, type McpAction } from '../actionTypes';

const shotItem = {
	type: 'object',
	properties: {
		description: textField('What we see and hear'),
		seconds: { type: 'number', description: 'How long the shot holds' },
		onScreenText: textField('Any text burnt in')
	},
	required: ['description']
};

export const contentActions: McpAction[] = [
	brandAction({
		name: 'draft_content',
		area: 'content',
		isWrite: true,
		summary: 'draft a piece for one medium — hook, script, storyboard, caption and the action it invites',
		guidance:
			'Call resolve_brand for the medium first and write in the brief. The piece keeps a snapshot of the brand as it stands now. It starts as drafted; send it for approval when it is ready.',
		properties: {
			medium: mediumField,
			title: textField('A working title'),
			trendId: textField('The trend it rides, if any'),
			hook: textField('The first line or first second'),
			script: textField('The full script or copy'),
			storyboard: { type: 'array', items: shotItem },
			caption: textField('The post caption'),
			invitedAction: textField('The audience action it asks for, such as save or clickThrough')
		},
		required: ['medium', 'title'],
		run: async ({ caller, brand }, input) =>
			`Drafted (id ${await draftContent(caller.supabase, brand, readContentDraft(input), caller.accountId)}).`
	}),
	brandAction({
		name: 'list_content',
		area: 'content',
		isWrite: false,
		summary: 'the brand’s pieces, newest first',
		properties: { status: textField(`${contentStatuses.join(', ')} — leave out for all`) },
		run: async ({ caller, brand }, input) => {
			const status = input.status === undefined ? null : readOneOf(input, 'status', 'status', contentStatuses);
			const pieces = await listContent(caller.supabase, brand.id, status);
			if (pieces.length === 0) return 'No content yet.';
			return pieces.map((piece) => `- [${piece.status}] ${piece.title} @ ${piece.mediumPath} (id ${piece.id})`).join('\n');
		}
	}),
	brandAction({
		name: 'read_content',
		area: 'content',
		isWrite: false,
		summary: 'one piece in full, with its brand snapshot and every review',
		properties: { contentId: textField('The piece id') },
		required: ['contentId'],
		run: async ({ caller, brand }, input) => {
			const contentId = readId(input, 'contentId', 'content');
			const piece = await getContent(caller.supabase, brand.id, contentId);
			if (piece === null) throw new InputProblem('That piece is not on this brand.');
			return describeContentPiece(piece, await getContentReviews(caller.supabase, contentId));
		}
	})
];
