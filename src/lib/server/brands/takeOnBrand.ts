import { readOptionalText, readRequiredText, type RawInput } from '$lib/server/input/readInput';
import type { SupabaseClient } from '@supabase/supabase-js';

const nameCharacters = 120;
const summaryCharacters = 1000;

export type BrandDraft = { name: string; summary: string };

export function readBrandDraft(input: RawInput): BrandDraft {
	return {
		name: readRequiredText(input, 'name', 'brand name', nameCharacters),
		summary: readOptionalText(input, 'summary', 'summary', summaryCharacters)
	};
}

export async function takeOnBrand(
	supabase: SupabaseClient,
	draft: BrandDraft,
	accountId: string
): Promise<string> {
	const { data, error } = await supabase
		.from('brands')
		.insert({ ...draft, created_by: accountId })
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

export async function describeBrand(supabase: SupabaseClient, brandId: string, draft: BrandDraft): Promise<void> {
	const { error } = await supabase.from('brands').update(draft).eq('id', brandId);
	if (error) throw error;
}
