import type { ContentPiece } from '$lib/work/contentPiece';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ContentReview = { verdict: string; body: string; createdAt: string };

const pieceColumns =
	'id, medium_path, trend_id, title, hook, script, storyboard, caption, invited_action, status, ' +
	'brand_snapshot, scheduled_for, published_url, updated_at';

export async function getContent(
	supabase: SupabaseClient,
	brandId: string,
	contentId: string
): Promise<ContentPiece | null> {
	const { data, error } = await supabase
		.from('content_pieces')
		.select(pieceColumns)
		.eq('brand_id', brandId)
		.eq('id', contentId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return pieceFrom(data as unknown as Record<string, never>);
}

function pieceFrom(row: Record<string, never>): ContentPiece {
	return {
		id: row.id,
		mediumPath: row.medium_path,
		trendId: row.trend_id,
		title: row.title,
		hook: row.hook,
		script: row.script,
		storyboard: row.storyboard,
		caption: row.caption,
		invitedAction: row.invited_action,
		status: row.status,
		brandSnapshot: row.brand_snapshot,
		scheduledFor: row.scheduled_for,
		publishedUrl: row.published_url,
		updatedAt: row.updated_at
	};
}

export async function getContentReviews(supabase: SupabaseClient, contentId: string): Promise<ContentReview[]> {
	const { data, error } = await supabase
		.from('content_reviews')
		.select('verdict, body, created_at')
		.eq('content_id', contentId)
		.order('created_at');
	if (error) throw error;
	return (data ?? []).map((row) => ({ verdict: row.verdict, body: row.body, createdAt: row.created_at }));
}
