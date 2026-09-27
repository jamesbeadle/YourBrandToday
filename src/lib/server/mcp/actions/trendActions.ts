import { brandAction, eachInBatch, readBatch } from './brandAction';
import { listTrends, setTrendStatus } from '$lib/server/trends/listTrends';
import { mediumField } from './brandKitReadActions';
import { readId, readOneOf } from '$lib/server/input/readInput';
import { readTrendDraft, recordTrend } from '$lib/server/trends/recordTrend';
import { textField, type McpAction } from '../actionTypes';
import { trendStatuses } from '$lib/work/trend';

const mostTrendsAtOnce = 50;

const trendItem = {
	type: 'object',
	properties: {
		medium: mediumField,
		title: textField('The trend in a few words'),
		summary: textField('What it is, what makes it work, and how people are using it'),
		sourceUrl: textField('A public link to an example'),
		fitScore: { type: 'number', description: 'How well it fits this brand, 0 to 100' },
		fitRationale: textField('Why that score, in terms of the brand brief')
	},
	required: ['medium', 'title', 'fitScore']
};

export const trendActions: McpAction[] = [
	brandAction({
		name: 'record_trends',
		area: 'trends',
		isWrite: true,
		summary: 'record trends you found rising, each scored for fit with the brand',
		guidance:
			'Search what is rising on the medium today — sounds, formats, hooks, topics. Call resolve_brand for the medium first, and score fit against its voice, behaviour, topics to avoid and audience; pass on anything the brand would never do.',
		properties: { trends: { type: 'array', items: trendItem } },
		required: ['trends'],
		run: async ({ caller, brand }, input) =>
			eachInBatch(readBatch(input, 'trends', mostTrendsAtOnce), async (item) => {
				const id = await recordTrend(caller.supabase, brand.id, readTrendDraft(item), caller.accountId);
				return `recorded ${String(item.title)} (id ${id})`;
			})
	}),
	brandAction({
		name: 'list_trends',
		area: 'trends',
		isWrite: false,
		summary: 'the trends recorded for the brand, best fit first',
		properties: { status: textField('watching, riding or passed — leave out for all') },
		run: async ({ caller, brand }, input) => {
			const status = input.status === undefined ? null : readOneOf(input, 'status', 'status', trendStatuses);
			const trends = await listTrends(caller.supabase, brand.id, status);
			if (trends.length === 0) return 'No trends recorded.';
			return trends
				.map((trend) => `- [${trend.status}] ${trend.fitScore}/100 ${trend.title} @ ${trend.mediumPath} (id ${trend.id}) — ${trend.fitRationale}`)
				.join('\n');
		}
	}),
	brandAction({
		name: 'set_trend_status',
		area: 'trends',
		isWrite: true,
		summary: 'mark a trend as watching, riding or passed',
		properties: { trendId: textField('The trend id'), status: textField('watching, riding or passed') },
		required: ['trendId', 'status'],
		run: async ({ caller, brand }, input) => {
			const status = readOneOf(input, 'status', 'status', trendStatuses);
			await setTrendStatus(caller.supabase, brand.id, readId(input, 'trendId', 'trend'), status);
			return `Now ${status}.`;
		}
	})
];
