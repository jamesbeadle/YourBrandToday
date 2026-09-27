export class InputProblem extends Error {}

export function problemMessageOf(failure: unknown): string | null {
	if (failure instanceof InputProblem) return failure.message;
	return null;
}
