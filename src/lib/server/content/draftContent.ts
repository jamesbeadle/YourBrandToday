import { assertOnBrand } from '$lib/server/brands/assertOnBrand';
import { brandBriefOf } from '$lib/brand/projections/brandBrief';
import { cssVariablesOf } from '$lib/brand/projections/cssVariables';
import { readInvitedAction } from './readInvitedAction';
import { readMedium } from '$lib/server/input/readMedium';
import { readOptionalId, readOptionalText, readRequiredText, type RawInput } from '$lib/server/input/readInput';
import { readStoryboard } from './readStoryboard';
import { resolveBrandFor } from '$lib/server/brands/resolveBrandFor';
import type { Brand } from '$lib/server/brands/getBrand';
import type { SupabaseClient } from '@supabase/supabase-js';

const ContentLimits = { title: 160, hook: 300, script: 10000, caption: 2200 } as const;

export function readContentDraft(input: RawInput) {
	const medium = readMedium(input);
	return {
		medium,
		trend_id: readOptionalId(input, 'trendId', 'trend'),
		title: readRequiredText(input, 'title', 'title', ContentLimits.title),
		hook: readOptionalText(input, 'hook', 'hook', ContentLimits.hook),
		script: readOptionalText(input, 'script', 'script', ContentLimits.script),
		storyboard: readStoryboard(input.storyboard),
		caption: readOptionalText(input, 'caption', 'caption', ContentLimits.caption),
		invited_action: readInvitedAction(input, medium)
	};
}

export async function draftContent(
	supabase: SupabaseClient,
	brand: Brand,
	draft: ReturnType<typeof readContentDraft>,
	accountId: string
): Promise<string> {
	const { medium, ...fields } = draft;
	await assertOnBrand(supabase, 'trends', brand.id, fields.trend_id);
	const resolved = await resolveBrandFor(supabase, brand.id, medium);
	const brandSnapshot = { brief: brandBriefOf(brand.name, resolved), variables: cssVariablesOf(resolved) };
	const { data, error } = await supabase
		.from('content_pieces')
		.insert({
			...fields,
			brand_id: brand.id,
			medium_path: medium.path,
			brand_snapshot: brandSnapshot,
			created_by: accountId
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}
