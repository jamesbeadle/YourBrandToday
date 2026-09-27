import { checkDecision } from '$lib/brand/decisions/checkDecision';
import { InputProblem } from '$lib/server/input/inputProblem';
import type { DecisionDraft, DecisionSource, DecisionStatus } from '$lib/brand/decisions/decision';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TraitDefinition } from '$lib/brand/traits/traitDefinition';

const rationaleCharacters = 1000;

export type DecisionRecording = {
	brandId: string;
	draft: DecisionDraft;
	rationale: string;
	source: DecisionSource;
	status: Exclude<DecisionStatus, 'retired'>;
	accountId: string;
};

export async function recordDecision(
	supabase: SupabaseClient,
	recording: DecisionRecording,
	catalogue: TraitDefinition[]
): Promise<string> {
	const check = checkDecision(recording.draft, catalogue);
	if ('problem' in check) throw new InputProblem(check.problem);
	if (recording.rationale.length > rationaleCharacters) {
		throw new InputProblem(`Keep the rationale to ${rationaleCharacters} characters.`);
	}
	const { traitKey, mediumPath, value } = check.decision;
	if (recording.status === 'adopted') await retireAdopted(supabase, recording.brandId, traitKey, mediumPath);
	const { data, error } = await supabase
		.from('brand_decisions')
		.insert({
			brand_id: recording.brandId,
			trait_key: traitKey,
			medium_path: mediumPath,
			value,
			rationale: recording.rationale,
			source: recording.source,
			status: recording.status,
			decided_by: recording.accountId
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

export async function retireAdopted(
	supabase: SupabaseClient,
	brandId: string,
	traitKey: string,
	mediumPath: string
): Promise<void> {
	const { error } = await supabase
		.from('brand_decisions')
		.update({ status: 'retired', status_changed_at: new Date().toISOString() })
		.eq('brand_id', brandId)
		.eq('trait_key', traitKey)
		.eq('medium_path', mediumPath)
		.eq('status', 'adopted');
	if (error) throw error;
}
