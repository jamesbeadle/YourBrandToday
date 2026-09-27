import { InputProblem } from '$lib/server/input/inputProblem';
import { retireAdopted } from './recordDecision';
import type { SupabaseClient } from '@supabase/supabase-js';

export type DecisionChange = 'adopt' | 'retire';

export async function changeDecisionStatus(
	supabase: SupabaseClient,
	brandId: string,
	decisionId: string,
	change: DecisionChange
): Promise<void> {
	const { data, error } = await supabase
		.from('brand_decisions')
		.select('trait_key, medium_path, status')
		.eq('brand_id', brandId)
		.eq('id', decisionId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) throw new InputProblem('That decision is not on this brand.');
	if (change === 'adopt' && data.status !== 'proposed') throw new InputProblem('Only a proposed decision can be adopted.');
	if (change === 'adopt') await retireAdopted(supabase, brandId, data.trait_key, data.medium_path);
	const status = change === 'adopt' ? 'adopted' : 'retired';
	const { error: updateError } = await supabase
		.from('brand_decisions')
		.update({ status, status_changed_at: new Date().toISOString() })
		.eq('id', decisionId);
	if (updateError) throw updateError;
}
