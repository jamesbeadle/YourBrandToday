import { findMedium } from '$lib/brand/mediums/mediumCatalogue';
import { InputProblem } from './inputProblem';
import type { Medium } from '$lib/brand/mediums/mediumDefinition';
import type { RawInput } from './readInput';

export function readMedium(input: RawInput, field = 'medium'): Medium {
	const path = String(input[field] ?? '').trim();
	const medium = findMedium(path);
	if (medium === null) throw new InputProblem(`${path || 'That'} is not a medium — see read_brand_catalogue.`);
	return medium;
}
