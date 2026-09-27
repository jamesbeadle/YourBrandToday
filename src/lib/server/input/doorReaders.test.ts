import { describe, expect, it } from 'vitest';
import { InputProblem } from './inputProblem';
import { readCampaignDraft } from '$lib/server/campaigns/planCampaign';
import { readReading } from '$lib/server/performance/recordReading';
import { readStoryboard } from '$lib/server/content/readStoryboard';
import { readTrendDraft } from '$lib/server/trends/recordTrend';

const refusal = (read: () => unknown) => {
	try {
		read();
	} catch (failure) {
		if (failure instanceof InputProblem) return failure.message;
		throw failure;
	}
	return null;
};

describe('reading a trend', () => {
	const trend = { medium: 'video.short.tiktok', title: 'Silent reviews', fitScore: 80 };

	it('accepts a trend on a real medium with a score in range', () => {
		expect(readTrendDraft(trend)).toMatchObject({ medium_path: 'video.short.tiktok', fit_score: 80 });
	});

	it('refuses a score out of range, an unknown medium and a private link', () => {
		expect(refusal(() => readTrendDraft({ ...trend, fitScore: 140 }))).toContain('0 to 100');
		expect(refusal(() => readTrendDraft({ ...trend, medium: 'video.hologram' }))).toContain('not a medium');
		expect(refusal(() => readTrendDraft({ ...trend, sourceUrl: 'http://localhost/x' }))).toContain('public');
	});
});

describe('reading a storyboard', () => {
	it('reads shots from a list or from JSON text', () => {
		const shots = [{ description: 'Close on the product', seconds: 2 }];
		expect(readStoryboard(shots)).toEqual([{ description: 'Close on the product', seconds: 2, onScreenText: '' }]);
		expect(readStoryboard(JSON.stringify(shots))).toHaveLength(1);
	});

	it('refuses a shot with no description or impossible seconds', () => {
		expect(refusal(() => readStoryboard([{ description: '' }]))).toContain('Shot 1');
		expect(refusal(() => readStoryboard([{ description: 'x', seconds: -1 }]))).toContain('seconds');
	});
});

describe('reading a campaign', () => {
	const campaign = { name: 'Autumn', objective: 'purchase', budgetPounds: 500, startsOn: '2026-10-01', endsOn: '2026-10-31' };

	it('stores the budget in pence', () => {
		expect(readCampaignDraft(campaign).budget_pence).toBe(50000);
	});

	it('refuses an objective the audience cannot do and dates in the wrong order', () => {
		expect(refusal(() => readCampaignDraft({ ...campaign, objective: 'stitch' }))).toContain('audience action');
		expect(refusal(() => readCampaignDraft({ ...campaign, endsOn: '2026-09-01' }))).toContain('ends before');
	});
});

describe('reading a performance reading', () => {
	it('fills missing counts with nought and refuses a negative one', () => {
		const reading = readReading({ medium: 'video.short.reels', observedOn: '2026-09-20', views: 1200 });
		expect(reading).toMatchObject({ views: 1200, likes: 0, spend_pence: 0 });
		expect(refusal(() => readReading({ medium: 'video', observedOn: '2026-09-20', views: -3 }))).toContain('views');
	});
});
