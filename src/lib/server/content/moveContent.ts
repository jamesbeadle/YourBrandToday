import { InputProblem } from '$lib/server/input/inputProblem';
import type { ContentStatus } from '$lib/work/contentPiece';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ContentMove =
	| { to: 'awaiting_approval' }
	| { to: 'scheduled'; scheduledFor: string }
	| { to: 'published'; publishedUrl: string };

const allowedFrom: Record<ContentMove['to'], ContentStatus[]> = {
	awaiting_approval: ['idea', 'drafted'],
	scheduled: ['approved', 'scheduled'],
	published: ['approved', 'scheduled']
};

const refusals: Record<ContentMove['to'], string> = {
	awaiting_approval: 'Only a drafted piece can be sent for approval.',
	scheduled: 'Only an approved piece can be scheduled.',
	published: 'Only an approved or scheduled piece can be published.'
};

export async function moveContent(
	supabase: SupabaseClient,
	brandId: string,
	contentId: string,
	move: ContentMove
): Promise<void> {
	const { data, error } = await supabase
		.from('content_pieces')
		.select('status')
		.eq('brand_id', brandId)
		.eq('id', contentId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) throw new InputProblem('That piece is not on this brand.');
	if (!allowedFrom[move.to].includes(data.status)) throw new InputProblem(refusals[move.to]);
	const { to, ...fields } = move;
	const columns = { status: to, updated_at: new Date().toISOString(), ...columnsOf(fields) };
	const { error: updateError } = await supabase.from('content_pieces').update(columns).eq('id', contentId);
	if (updateError) throw updateError;
}

function columnsOf(fields: { scheduledFor?: string; publishedUrl?: string }): Record<string, string> {
	if (fields.scheduledFor !== undefined) return { scheduled_for: fields.scheduledFor };
	if (fields.publishedUrl !== undefined) return { published_url: fields.publishedUrl };
	return {};
}
