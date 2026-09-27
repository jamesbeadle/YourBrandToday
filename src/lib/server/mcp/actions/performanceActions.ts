import { brandAction, eachInBatch, readBatch } from './brandAction';
import { countedFigures, readReading, recordReading } from '$lib/server/performance/recordReading';
import { mediumField } from './brandKitReadActions';
import { readIsoDate } from '$lib/server/input/readNumbers';
import { summarisePerformance, totalOf } from '$lib/server/performance/performanceSummary';
import { textField, type McpAction } from '../actionTypes';

const mostReadingsAtOnce = 200;
const penceInAPound = 100;

const readingItem = {
	type: 'object',
	properties: {
		medium: mediumField,
		observedOn: textField('The day the figures are for, YYYY-MM-DD'),
		contentId: textField('The piece, if the figures are for one'),
		campaignId: textField('The campaign, if the figures are for one'),
		spendPounds: { type: 'number', description: 'Ad spend that day, in pounds' },
		...Object.fromEntries(countedFigures.map((figure) => [figure, { type: 'number', description: `Count of ${figure}` }]))
	},
	required: ['medium', 'observedOn']
};

export const performanceActions: McpAction[] = [
	brandAction({
		name: 'record_performance',
		area: 'performance',
		isWrite: true,
		summary: 'record how pieces and campaigns performed — views, watch time, engagement, clicks, spend',
		guidance: 'Record figures exactly as the platform reports them, one reading per piece or campaign per day.',
		properties: { readings: { type: 'array', items: readingItem } },
		required: ['readings'],
		run: async ({ caller, brand }, input) =>
			eachInBatch(readBatch(input, 'readings', mostReadingsAtOnce), async (item) => {
				await recordReading(caller.supabase, brand.id, readReading(item), caller.accountId);
				return `recorded ${String(item.medium)} on ${String(item.observedOn)}`;
			})
	}),
	brandAction({
		name: 'read_performance',
		area: 'performance',
		isWrite: false,
		summary: 'how the brand has performed since a date, medium by medium',
		guidance: 'When a pattern shows — a behaviour or a look that does better — propose it with record_brand_decisions and propose: true.',
		properties: { since: textField('YYYY-MM-DD') },
		required: ['since'],
		run: async ({ caller, brand }, input) => {
			const rows = await summarisePerformance(caller.supabase, brand.id, readIsoDate(input, 'since', 'since date'));
			if (rows.length === 0) return 'No readings since then.';
			return [...rows, { ...totalOf(rows), mediumPath: 'total' }]
				.map((row) => `- ${row.mediumPath}: ${row.views} views, ${row.watchSeconds}s watched, ${row.engagements} engagements, ${row.clicks} clicks, ${row.conversions} conversions, £${row.spendPence / penceInAPound} spent`)
				.join('\n');
		}
	})
];
