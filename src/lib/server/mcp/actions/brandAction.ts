import { brandRoleFor, canShapeBrand, type BrandRole } from '$lib/server/brands/brandRole';
import { getBrand, type Brand } from '$lib/server/brands/getBrand';
import { InputProblem } from '$lib/server/input/inputProblem';
import { readId, type RawInput } from '$lib/server/input/readInput';
import { textField } from '../actionTypes';
import type { ActionArea, McpAction } from '../actionTypes';
import type { McpCaller } from '../resolveMcpCaller';

export type BrandActionContext = { caller: McpCaller; brand: Brand; role: BrandRole };

type BrandActionShape = {
	name: string;
	area: ActionArea;
	isWrite: boolean;
	isOpenToViewers?: boolean;
	summary: string;
	guidance?: string;
	properties: Record<string, unknown>;
	required?: string[];
	run: (context: BrandActionContext, input: RawInput) => Promise<string>;
};

export const brandIdField = textField('The brand id, from get_current_context or list_brands');

export function brandAction(shape: BrandActionShape): McpAction {
	return {
		name: shape.name,
		area: shape.area,
		audience: 'everyone',
		isWrite: shape.isWrite,
		summary: shape.summary,
		guidance: shape.guidance,
		inputSchema: {
			type: 'object',
			properties: { brandId: brandIdField, ...shape.properties },
			required: ['brandId', ...(shape.required ?? [])],
			additionalProperties: false
		},
		run: async (caller, input) =>
			shape.run(await enterBrand(caller, input, shape.isWrite && shape.isOpenToViewers !== true), input)
	};
}

async function enterBrand(caller: McpCaller, input: RawInput, needsShaping: boolean): Promise<BrandActionContext> {
	const brandId = readId(input, 'brandId', 'brand');
	const role = await brandRoleFor(caller.supabase, caller, brandId);
	const brand = role === null ? null : await getBrand(caller.supabase, brandId);
	if (role === null || brand === null) throw new InputProblem('You are not on that brand.');
	if (needsShaping && !canShapeBrand(role)) {
		throw new InputProblem('You can see this brand but not change it — ask its owner.');
	}
	return { caller, brand, role };
}

export function readBatch(input: RawInput, field: string, mostItems: number): RawInput[] {
	const items = input[field];
	if (!Array.isArray(items) || items.length === 0) throw new InputProblem(`${field} is a list of at least one.`);
	if (items.length > mostItems) throw new InputProblem(`Send at most ${mostItems} ${field} at a time.`);
	return items.map((item) => (typeof item === 'object' && item !== null ? (item as RawInput) : {}));
}

export async function eachInBatch(
	items: RawInput[],
	record: (item: RawInput) => Promise<string>
): Promise<string> {
	const lines: string[] = [];
	for (const [index, item] of items.entries()) {
		lines.push(`${index + 1}. ${await outcomeOf(() => record(item))}`);
	}
	return lines.join('\n');
}

async function outcomeOf(record: () => Promise<string>): Promise<string> {
	try {
		return await record();
	} catch (failure) {
		if (failure instanceof InputProblem) return `refused — ${failure.message}`;
		throw failure;
	}
}
