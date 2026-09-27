import { describe, expect, it } from 'vitest';
import { actionsFor } from './actionRegistry';

const client = { accountId: 'a', email: 'client@x', isStaff: false, isAdmin: false, isRestricted: false };
const staff = { ...client, isStaff: true };

describe('the actions a caller may run', () => {
	it('names every action once', () => {
		const names = actionsFor(staff, null).map((action) => action.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('keeps taking on a brand to our staff', () => {
		expect(actionsFor(client, null).some((action) => action.name === 'take_on_brand')).toBe(false);
		expect(actionsFor(staff, null).some((action) => action.name === 'take_on_brand')).toBe(true);
	});

	it('asks every brand action for the brand it acts on', () => {
		const brandActions = actionsFor(staff, null).filter((action) => 'brandId' in (action.inputSchema.properties as object));
		expect(brandActions.length).toBeGreaterThan(20);
		for (const action of brandActions) expect(action.inputSchema.required).toContain('brandId');
	});
});
