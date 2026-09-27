import { brandAction } from './brandAction';
import { brandBriefOf } from '$lib/brand/projections/brandBrief';
import { cssVariablesOf } from '$lib/brand/projections/cssVariables';
import { describeCatalogue } from './describeCatalogue';
import { describeDecisions } from './describeDecisions';
import { listBrands } from '$lib/server/brands/listBrands';
import { loadBrandModel } from '$lib/server/brands/loadBrandModel';
import { objectSchema, textField, type McpAction } from '../actionTypes';
import { readMedium } from '$lib/server/input/readMedium';
import { resolveBrandFor } from '$lib/server/brands/resolveBrandFor';

export const mediumField = textField('A medium path such as all, video.short.tiktok or text.email');

export const brandKitReadActions: McpAction[] = [
	{
		name: 'list_brands',
		area: 'brand',
		audience: 'everyone',
		isWrite: false,
		summary: 'the brands you reach, with your role on each',
		inputSchema: objectSchema({}),
		run: async (caller) => {
			const brands = await listBrands(caller.supabase, caller);
			if (brands.length === 0) return 'You are not on any brand yet.';
			return brands.map((brand) => `- ${brand.name} (${brand.id}) — ${brand.role}`).join('\n');
		}
	},
	brandAction({
		name: 'read_brand_catalogue',
		area: 'brand',
		isWrite: false,
		summary: 'every facet, trait, kind, medium and action this brand can decide',
		properties: {},
		run: async ({ caller, brand }) => describeCatalogue((await loadBrandModel(caller.supabase, brand.id)).catalogue)
	}),
	brandAction({
		name: 'read_brand',
		area: 'brand',
		isWrite: false,
		summary: 'every decision the brand has adopted or has proposed, at every medium',
		properties: {},
		run: async ({ caller, brand }) =>
			describeDecisions(brand.name, (await loadBrandModel(caller.supabase, brand.id)).decisions)
	}),
	brandAction({
		name: 'resolve_brand',
		area: 'brand',
		isWrite: false,
		summary: 'the brand as it applies to one medium — the brief to follow, the style variables, and the gaps',
		guidance: 'Call this before writing, scripting or designing anything for the brand, and follow the brief.',
		properties: { medium: mediumField },
		required: ['medium'],
		run: async ({ caller, brand }, input) => {
			const resolved = await resolveBrandFor(caller.supabase, brand.id, readMedium(input));
			const variables = JSON.stringify(cssVariablesOf(resolved), null, 2);
			return `${brandBriefOf(brand.name, resolved)}\n\nStyle variables:\n${variables}`;
		}
	})
];
