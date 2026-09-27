export const trendStatuses = ['watching', 'riding', 'passed'] as const;

export type TrendStatus = (typeof trendStatuses)[number];

export type Trend = {
	id: string;
	mediumPath: string;
	title: string;
	summary: string;
	sourceUrl: string;
	fitScore: number;
	fitRationale: string;
	status: TrendStatus;
	observedOn: string;
};
