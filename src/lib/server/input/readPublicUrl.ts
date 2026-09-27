import { InputProblem } from './inputProblem';
import { parsePublicUrl } from '$lib/server/web/parsePublicUrl';
import type { RawInput } from './readInput';

const urlCharacters = 500;

export function readOptionalPublicUrl(input: RawInput, field: string, label: string): string {
	const text = String(input[field] ?? '').trim();
	if (text === '') return '';
	const parsed = parsePublicUrl(text);
	if (parsed === null) throw new InputProblem(`The ${label} is a public http or https link.`);
	if (parsed.href.length > urlCharacters) throw new InputProblem(`Keep the ${label} to ${urlCharacters} characters.`);
	return parsed.href;
}

export function readPublicUrl(input: RawInput, field: string, label: string): string {
	const url = readOptionalPublicUrl(input, field, label);
	if (url === '') throw new InputProblem(`The ${label} is needed.`);
	return url;
}
