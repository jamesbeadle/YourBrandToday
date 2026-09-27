import { brandRoleFor, canShapeBrand, type BrandRole } from './brandRole';
import { error } from '@sveltejs/kit';
import { getBrand, type Brand } from './getBrand';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { isUuid } from '$lib/data/isUuid';
import { requireUser } from '$lib/server/auth/requireUser';

const forbidden = 403;
const notFound = 404;

export type BrandVisit = { brand: Brand; role: BrandRole; accountId: string; canShape: boolean };

export async function requireBrand(locals: App.Locals, brandId: string): Promise<BrandVisit> {
	const user = await requireUser(locals);
	if (!isUuid(brandId)) error(notFound, 'There is no such brand.');
	const profileFlags = await getProfileFlags(locals.supabase);
	const isStaff = !profileFlags.isRestricted && (profileFlags.isStaff || profileFlags.isAdmin);
	const role = await brandRoleFor(locals.supabase, { accountId: user.id, isStaff }, brandId);
	const brand = role === null ? null : await getBrand(locals.supabase, brandId);
	if (role === null || brand === null) error(notFound, 'There is no such brand, or you are not on it.');
	return { brand, role, accountId: user.id, canShape: canShapeBrand(role) };
}

export async function requireShaping(locals: App.Locals, brandId: string): Promise<BrandVisit> {
	const visit = await requireBrand(locals, brandId);
	if (!visit.canShape) error(forbidden, 'You can see this brand but not change it.');
	return visit;
}
