import { InputProblem } from '$lib/server/input/inputProblem';
import { readPublicUrl } from '$lib/server/input/readPublicUrl';
import type { ContentMove } from './moveContent';
import type { RawInput } from '$lib/server/input/readInput';

export function readSchedule(input: RawInput): ContentMove {
	const when = Date.parse(String(input.scheduledFor ?? ''));
	if (Number.isNaN(when)) throw new InputProblem('Give the time to publish, such as 2026-10-01T09:00:00Z.');
	return { to: 'scheduled', scheduledFor: new Date(when).toISOString() };
}

export function readPublication(input: RawInput): ContentMove {
	return { to: 'published', publishedUrl: readPublicUrl(input, 'publishedUrl', 'published link') };
}
