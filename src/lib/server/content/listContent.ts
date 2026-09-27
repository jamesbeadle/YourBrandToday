import type { ContentStatus, ContentSummary } from '$lib/work/contentPiece';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function listContent(
	supabase: SupabaseClient,
	brandId: string,
	status: ContentStatus | null
): Promise<ContentSummary[]> {
	let query = supabase
		.from('content_pieces')
		.select('id, medium_path, title, status, scheduled_for, updated_at')
		.eq('brand_id', brandId);
	if (status !== null) query = query.eq('status', status);
	const { data, error } = await query.order('updated_at', { ascending: false }).limit(200);
	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		mediumPath: row.medium_path,
		title: row.title,
		status: row.status,
		scheduledFor: row.scheduled_for,
		updatedAt: row.updated_at
	}));
}
