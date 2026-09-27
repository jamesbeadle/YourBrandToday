import { objectSchema } from '../actionTypes';
import type { McpAction } from '../actionTypes';
import type { McpCaller } from '../resolveMcpCaller';

export const accountActions: McpAction[] = [
	{
		name: 'who_am_i',
		area: 'account',
		audience: 'everyone',
		isWrite: false,
		summary: 'Your email address, your standing here, and what that lets you do',
		inputSchema: objectSchema({}),
		run: async (caller) => [`Email: ${caller.email}`, `Standing: ${standingOf(caller)}`].join('\n')
	}
];

function standingOf(caller: McpCaller): string {
	if (caller.isAdmin) return 'administrator — every brand, and the accounts';
	if (caller.isStaff) return 'Your Brand Today staff — every brand we manage';
	return 'client — the brands you have been added to';
}
