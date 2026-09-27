import { addBrandMember, readMembershipDraft } from '$lib/server/brands/addBrandMember';
import { brandAction } from './brandAction';
import { describeBrand, readBrandDraft, takeOnBrand } from '$lib/server/brands/takeOnBrand';
import { InputProblem } from '$lib/server/input/inputProblem';
import { objectSchema, textField, type McpAction } from '../actionTypes';

const brandFields = {
	name: textField('The brand’s name'),
	summary: textField('What the brand is, in a sentence or two')
};

export const brandMembershipActions: McpAction[] = [
	{
		name: 'take_on_brand',
		area: 'brand',
		audience: 'staff',
		isWrite: true,
		summary: 'take on a new client brand',
		inputSchema: objectSchema(brandFields, ['name']),
		run: async (caller, input) => {
			const brandId = await takeOnBrand(caller.supabase, readBrandDraft(input), caller.accountId);
			return `Took on the brand (id ${brandId}). Add its owner with add_brand_member.`;
		}
	},
	brandAction({
		name: 'describe_brand',
		area: 'brand',
		isWrite: true,
		summary: 'change the brand’s name or summary',
		properties: brandFields,
		required: ['name'],
		run: async ({ caller, brand }, input) => {
			await describeBrand(caller.supabase, brand.id, readBrandDraft(input));
			return 'Saved.';
		}
	}),
	brandAction({
		name: 'add_brand_member',
		area: 'brand',
		isWrite: true,
		summary: 'put someone on the brand as its owner, a manager or a viewer (staff only)',
		properties: { email: textField('Their account email'), role: textField('owner, manager or viewer') },
		required: ['email', 'role'],
		run: async ({ caller, brand, role }, input) => {
			if (role !== 'staff') throw new InputProblem('Only our staff put people on a brand.');
			const draft = readMembershipDraft(input);
			await addBrandMember(caller.supabase, brand.id, draft);
			return `${draft.email} is now ${draft.role} of ${brand.name}.`;
		}
	})
];
