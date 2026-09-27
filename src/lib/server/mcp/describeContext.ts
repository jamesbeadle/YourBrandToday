import { actionsFor, areasFor } from './actionRegistry';
import { listBrands } from '$lib/server/brands/listBrands';
import type { McpCaller } from './resolveMcpCaller';

const doctrine = [
	'How the brand works: every decision a brand makes — a colour, a border width, a caption animation, a word it never says, whether it replies to comments or stitches other videos, what it asks viewers to do — is a trait, decided at a medium (all, video, video.short.tiktok, text.email…). Deeper mediums override shallower ones.',
	'Before making anything, call resolve_brand for the medium you are making it for and follow the brief exactly. Never invent a brand decision: if a trait you need is a gap, ask the person, then record it with record_brand_decisions.',
	'When you learn something about the brand from a website, a style guide, or how content performed, record it — as adopted when the person has said so, as proposed when it is your suggestion.',
	'Read read_brand_catalogue once to learn the trait keys, kinds, mediums and actions.'
].join('\n');

export async function describeContext(caller: McpCaller): Promise<string> {
	const brands = await listBrands(caller.supabase, caller);
	const brandLines = brands.map((brand) => `- ${brand.name} (${brand.id}) — you are ${brand.role}`);
	return [
		`Signed in as ${caller.email}.`,
		brands.length === 0 ? 'You are not on any brand yet.' : `Brands you reach:\n${brandLines.join('\n')}`,
		`Areas you can reach: ${areasFor(caller).join(', ')}.`,
		`${actionsFor(caller, null).length} actions are available to you — call list_actions to see them.`,
		doctrine
	].join('\n\n');
}
