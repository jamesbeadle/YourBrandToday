import { checkCustomTrait, type CustomTraitDraft } from '$lib/brand/decisions/checkCustomTrait';
import { InputProblem } from '$lib/server/input/inputProblem';
import type { RawInput } from '$lib/server/input/readInput';
import type { SupabaseClient } from '@supabase/supabase-js';

export function readCustomTraitDraft(input: RawInput): CustomTraitDraft {
	const text = (field: string) => String(input[field] ?? '').trim();
	return {
		facet: text('facet'),
		name: text('name'),
		kind: text('kind'),
		label: text('label'),
		purpose: text('purpose'),
		choices: choicesOf(input.choices)
	};
}

export async function defineCustomTrait(
	supabase: SupabaseClient,
	brandId: string,
	draft: CustomTraitDraft
): Promise<string> {
	const check = checkCustomTrait(draft);
	if ('problem' in check) throw new InputProblem(check.problem);
	const { key, facet, kind, label, purpose, choices } = check.trait;
	const { error } = await supabase
		.from('brand_traits')
		.insert({ brand_id: brandId, key, facet, kind, label, purpose, choices: choices ?? [] });
	if (error) throw error;
	return key;
}

function choicesOf(raw: unknown): string[] {
	const items = Array.isArray(raw) ? raw.map(String) : String(raw ?? '').split('\n');
	return items.map((item) => item.trim()).filter((item) => item !== '');
}
