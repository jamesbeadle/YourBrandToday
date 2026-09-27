import { requireBrand } from '$lib/server/brands/requireBrand';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const visit = await requireBrand(locals, params.brandId);
	return { brand: visit.brand, role: visit.role, canShape: visit.canShape };
};
