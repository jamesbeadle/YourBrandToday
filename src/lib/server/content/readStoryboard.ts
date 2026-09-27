import { InputProblem } from '$lib/server/input/inputProblem';
import type { StoryboardShot } from '$lib/work/contentPiece';

const StoryboardLimits = { shots: 40, description: 500, onScreenText: 200, longestShotSeconds: 600 } as const;

export function readStoryboard(raw: unknown): StoryboardShot[] {
	if (raw === undefined || raw === null || raw === '') return [];
	const shots = typeof raw === 'string' ? parseJson(raw) : raw;
	if (!Array.isArray(shots)) throw new InputProblem('The storyboard is a list of shots.');
	if (shots.length > StoryboardLimits.shots) {
		throw new InputProblem(`Keep the storyboard to ${StoryboardLimits.shots} shots.`);
	}
	return shots.map(readShot);
}

function readShot(raw: unknown, index: number): StoryboardShot {
	const shot = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
	const description = String(shot.description ?? '').trim();
	const onScreenText = String(shot.onScreenText ?? '').trim();
	const seconds = Number(shot.seconds ?? 0);
	const shotName = `Shot ${index + 1}`;
	if (description === '' || description.length > StoryboardLimits.description) {
		throw new InputProblem(`${shotName} needs a description of up to ${StoryboardLimits.description} characters.`);
	}
	if (onScreenText.length > StoryboardLimits.onScreenText) {
		throw new InputProblem(`${shotName}: keep the on-screen text to ${StoryboardLimits.onScreenText} characters.`);
	}
	if (!Number.isFinite(seconds) || seconds < 0 || seconds > StoryboardLimits.longestShotSeconds) {
		throw new InputProblem(`${shotName}: seconds is a number up to ${StoryboardLimits.longestShotSeconds}.`);
	}
	return { description, seconds, onScreenText };
}

function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		throw new InputProblem('The storyboard is not readable JSON.');
	}
}
