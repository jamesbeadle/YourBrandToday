import { describeTraitValue } from '$lib/brand/values/traitValue';
import type { Decision } from '$lib/brand/decisions/decision';

export function describeDecisions(brandName: string, decisions: Decision[]): string {
	if (decisions.length === 0) return `${brandName} has no decisions yet.`;
	const lines = decisions.map(
		(decision) =>
			`- [${decision.status}] ${decision.traitKey} @ ${decision.mediumPath} = ${describeTraitValue(decision.value)}` +
			` (id ${decision.id}, ${decision.source})${decision.rationale === '' ? '' : ` — ${decision.rationale}`}`
	);
	return [`${brandName}: ${decisions.length} decisions in force or proposed`, ...lines].join('\n');
}
