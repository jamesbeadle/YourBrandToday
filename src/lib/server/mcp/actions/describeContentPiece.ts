import type { ContentPiece } from '$lib/work/contentPiece';
import type { ContentReview } from '$lib/server/content/getContent';

export function describeContentPiece(piece: ContentPiece, reviews: ContentReview[]): string {
	const shots = piece.storyboard.map(
		(shot, index) => `  ${index + 1}. (${shot.seconds}s) ${shot.description}${shot.onScreenText ? ` — “${shot.onScreenText}”` : ''}`
	);
	return [
		`${piece.title} — ${piece.status} — ${piece.mediumPath}`,
		`Hook: ${piece.hook}`,
		`Script:\n${piece.script}`,
		shots.length === 0 ? null : `Storyboard:\n${shots.join('\n')}`,
		`Caption: ${piece.caption}`,
		`Invites: ${piece.invitedAction || 'nothing in particular'}`,
		piece.scheduledFor === null ? null : `Scheduled for ${piece.scheduledFor}`,
		piece.publishedUrl === '' ? null : `Published at ${piece.publishedUrl}`,
		reviews.length === 0 ? 'No reviews yet.' : `Reviews:\n${reviews.map((review) => `- ${review.verdict}: ${review.body}`).join('\n')}`,
		`Brand as it stood when drafted:\n${piece.brandSnapshot.brief ?? ''}`
	]
		.filter((line) => line !== null)
		.join('\n\n');
}
