export const contentStatuses = [
	'idea',
	'drafted',
	'awaiting_approval',
	'approved',
	'scheduled',
	'published'
] as const;

export type ContentStatus = (typeof contentStatuses)[number];

export type StoryboardShot = { description: string; seconds: number; onScreenText: string };

export type ContentSummary = {
	id: string;
	mediumPath: string;
	title: string;
	status: ContentStatus;
	scheduledFor: string | null;
	updatedAt: string;
};

export type ContentPiece = ContentSummary & {
	trendId: string | null;
	hook: string;
	script: string;
	storyboard: StoryboardShot[];
	caption: string;
	invitedAction: string;
	publishedUrl: string;
	brandSnapshot: { brief?: string; variables?: Record<string, string> };
};

export const contentStatusLabels: Record<ContentStatus, string> = {
	idea: 'Idea',
	drafted: 'Drafted',
	awaiting_approval: 'Awaiting approval',
	approved: 'Approved',
	scheduled: 'Scheduled',
	published: 'Published'
};
