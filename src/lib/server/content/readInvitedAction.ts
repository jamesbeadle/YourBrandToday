import { InputProblem } from '$lib/server/input/inputProblem';
import { isAudienceActionKey } from '$lib/brand/actions/actionCatalogue';
import type { Medium } from '$lib/brand/mediums/mediumDefinition';
import type { RawInput } from '$lib/server/input/readInput';

export function readInvitedAction(input: RawInput, medium: Medium): string {
	const actionKey = String(input.invitedAction ?? '').trim();
	if (actionKey === '') return '';
	if (!isAudienceActionKey(actionKey)) throw new InputProblem(`${actionKey} is not something an audience does.`);
	if (!medium.actions.includes(actionKey)) {
		throw new InputProblem(`${medium.label} does not let people ${actionKey}.`);
	}
	return actionKey;
}
