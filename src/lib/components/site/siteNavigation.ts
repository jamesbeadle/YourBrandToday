import type { NavigationGroup, NavigationLink } from './navigationLink';

export type NavigationAccess = {
	isSignedIn: boolean;
	isStaff: boolean;
	isAdmin: boolean;
};

export const primaryNavigationLinks: NavigationLink[] = [
	{ href: '/', label: 'Home' },
	{ href: '/contact', label: 'Contact' }
];

export function buildMenuGroups(access: NavigationAccess): NavigationGroup[] {
	const groups: NavigationGroup[] = [{ label: 'Explore', links: primaryNavigationLinks }];
	if (access.isSignedIn) groups.push({ label: 'Your brands', links: brandLinks(access) });
	groups.push({ label: 'Account', links: accountLinks(access) });
	return groups;
}

function brandLinks(access: NavigationAccess): NavigationLink[] {
	const brands = { href: '/brands', label: 'Brands' };
	if (!access.isAdmin) return [brands];
	return [brands, { href: '/admin', label: 'Admin' }];
}

function accountLinks(access: NavigationAccess): NavigationLink[] {
	if (!access.isSignedIn) return [{ href: '/account/sign-in', label: 'Sign in' }];
	return [{ href: '/account', label: 'Account' }];
}
