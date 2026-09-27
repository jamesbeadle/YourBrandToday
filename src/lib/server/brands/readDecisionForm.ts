import { findTrait } from '$lib/brand/traits/traitCatalogue';
import { readOptionalText, type RawInput } from '$lib/server/input/readInput';
import type { DecisionDraft } from '$lib/brand/decisions/decision';
import type { TraitDefinition } from '$lib/brand/traits/traitDefinition';

const rationaleCharacters = 1000;

export function readDecisionForm(
	input: RawInput,
	catalogue: TraitDefinition[]
): { draft: DecisionDraft; rationale: string } {
	const traitKey = String(input.trait ?? '');
	const isActionRule = findTrait(catalogue, traitKey)?.kind === 'actionRule';
	const value = isActionRule ? { stance: input.stance, guidance: input.value } : input.value;
	return {
		draft: { traitKey, mediumPath: String(input.medium ?? ''), value },
		rationale: readOptionalText(input, 'rationale', 'rationale', rationaleCharacters)
	};
}
