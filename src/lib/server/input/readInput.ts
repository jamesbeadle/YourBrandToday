import { InputProblem } from './inputProblem';
import { isUuid } from '$lib/data/isUuid';

export type RawInput = Record<string, unknown>;

export function readOptionalText(input: RawInput, field: string, label: string, limit: number): string {
	const text = String(input[field] ?? '').trim();
	if (text.length > limit) throw new InputProblem(`Keep the ${label} to ${limit} characters.`);
	return text;
}

export function readRequiredText(input: RawInput, field: string, label: string, limit: number): string {
	const text = readOptionalText(input, field, label, limit);
	if (text === '') throw new InputProblem(`The ${label} is needed.`);
	return text;
}

export function readId(input: RawInput, field: string, label: string): string {
	const id = String(input[field] ?? '').trim();
	if (!isUuid(id)) throw new InputProblem(`That is not a ${label} id.`);
	return id;
}

export function readOptionalId(input: RawInput, field: string, label: string): string | null {
	if (String(input[field] ?? '').trim() === '') return null;
	return readId(input, field, label);
}

export function readOneOf<Choice extends string>(
	input: RawInput,
	field: string,
	label: string,
	choices: readonly Choice[]
): Choice {
	const value = String(input[field] ?? '').trim();
	const choice = choices.find((candidate) => candidate === value);
	if (choice === undefined) throw new InputProblem(`The ${label} is one of ${choices.join(', ')}.`);
	return choice;
}

export function rawInputOf(formData: FormData): RawInput {
	return Object.fromEntries(formData.entries());
}
