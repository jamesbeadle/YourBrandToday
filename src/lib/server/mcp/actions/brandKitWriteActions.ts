import { brandAction, eachInBatch, readBatch } from './brandAction';
import { changeDecisionStatus } from '$lib/server/brands/changeDecisionStatus';
import { decisionSourceFor } from '$lib/server/brands/brandRole';
import { defineCustomTrait, readCustomTraitDraft } from '$lib/server/brands/defineCustomTrait';
import { loadBrandModel } from '$lib/server/brands/loadBrandModel';
import { readId, readOptionalText } from '$lib/server/input/readInput';
import { recordDecision } from '$lib/server/brands/recordDecision';
import { textField, type McpAction } from '../actionTypes';
import { brandMembershipActions } from './brandMembershipActions';

const mostDecisionsAtOnce = 100;
const rationaleCharacters = 1000;

const decisionItem = {
	type: 'object',
	properties: {
		trait: textField('The trait key, such as look.shape.borderWidth or behaviour.reply'),
		medium: textField('Where it holds — all, or a medium path such as video.short'),
		value: { description: 'The value, in the trait’s kind (see read_brand_catalogue)' },
		rationale: textField('Why — where it came from, or what it is for')
	},
	required: ['trait', 'medium', 'value']
};

export const brandKitWriteActions: McpAction[] = [
	...brandMembershipActions,
	brandAction({
		name: 'record_brand_decisions',
		area: 'brand',
		isWrite: true,
		summary: 'record many brand decisions at once — colours to reply habits — each checked against its trait',
		guidance:
			'Use propose: true for your own suggestions; the owner adopts them. A new adopted decision replaces the one at the same trait and medium. Each decision is checked on its own, and refused ones say why.',
		properties: { decisions: { type: 'array', items: decisionItem }, propose: { type: 'boolean' } },
		required: ['decisions'],
		run: async ({ caller, brand, role }, input) => {
			const { catalogue } = await loadBrandModel(caller.supabase, brand.id);
			const status = input.propose === true ? 'proposed' : 'adopted';
			return eachInBatch(readBatch(input, 'decisions', mostDecisionsAtOnce), async (item) => {
				const draft = { traitKey: String(item.trait ?? ''), mediumPath: String(item.medium ?? ''), value: item.value };
				const rationale = readOptionalText(item, 'rationale', 'rationale', rationaleCharacters);
				const source = input.propose === true ? 'mcp' : decisionSourceFor(role);
				const recording = { brandId: brand.id, draft, rationale, source, status, accountId: caller.accountId } as const;
				const id = await recordDecision(caller.supabase, recording, catalogue);
				return `${status} ${draft.traitKey} @ ${draft.mediumPath} (id ${id})`;
			});
		}
	}),
	brandAction({
		name: 'adopt_brand_decision',
		area: 'brand',
		isWrite: true,
		summary: 'adopt a proposed decision, replacing whatever held at that trait and medium',
		properties: { decisionId: textField('The decision id, from read_brand') },
		required: ['decisionId'],
		run: async ({ caller, brand }, input) => {
			await changeDecisionStatus(caller.supabase, brand.id, readId(input, 'decisionId', 'decision'), 'adopt');
			return 'Adopted.';
		}
	}),
	brandAction({
		name: 'retire_brand_decision',
		area: 'brand',
		isWrite: true,
		summary: 'retire a decision, so the medium above it holds again',
		properties: { decisionId: textField('The decision id, from read_brand') },
		required: ['decisionId'],
		run: async ({ caller, brand }, input) => {
			await changeDecisionStatus(caller.supabase, brand.id, readId(input, 'decisionId', 'decision'), 'retire');
			return 'Retired.';
		}
	}),
	brandAction({
		name: 'define_brand_trait',
		area: 'brand',
		isWrite: true,
		summary: 'add a trait of the brand’s own — a seasonal colour, a mascot’s catchphrase',
		properties: {
			facet: textField('look, motion, sound, voice, behaviour, response or audience'),
			name: textField('Words joined by dots, such as colour.seasonal'),
			kind: textField('Any kind but actionRule'),
			label: textField('What people call it'),
			purpose: textField('What it is for'),
			choices: { type: 'array', items: { type: 'string' }, description: 'For a choice, the options' }
		},
		required: ['facet', 'name', 'kind', 'label'],
		run: async ({ caller, brand }, input) =>
			`Defined ${await defineCustomTrait(caller.supabase, brand.id, readCustomTraitDraft(input))}.`
	})
];
