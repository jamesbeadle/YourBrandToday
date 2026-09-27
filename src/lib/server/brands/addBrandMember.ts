import { InputProblem } from '$lib/server/input/inputProblem';
import { memberRoles, type MemberRole } from './brandRole';
import { readOneOf, readRequiredText, type RawInput } from '$lib/server/input/readInput';
import type { SupabaseClient } from '@supabase/supabase-js';

const emailCharacters = 320;

export type MembershipDraft = { email: string; role: MemberRole };

export function readMembershipDraft(input: RawInput): MembershipDraft {
	return {
		email: readRequiredText(input, 'email', 'email address', emailCharacters).toLowerCase(),
		role: readOneOf(input, 'role', 'role', memberRoles)
	};
}

export async function addBrandMember(
	serviceClient: SupabaseClient,
	brandId: string,
	draft: MembershipDraft
): Promise<void> {
	const { data, error } = await serviceClient
		.from('profiles')
		.select('id')
		.eq('email', draft.email)
		.maybeSingle();
	if (error) throw error;
	if (data === null) throw new InputProblem(`${draft.email} has no account yet — ask them to sign in once first.`);
	const { error: upsertError } = await serviceClient
		.from('brand_members')
		.upsert({ brand_id: brandId, account_id: data.id, role: draft.role });
	if (upsertError) throw upsertError;
}
