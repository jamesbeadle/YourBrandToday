import { fail } from '@sveltejs/kit';
import { problemMessageOf } from '$lib/server/input/inputProblem';
import { rawInputOf, type RawInput } from '$lib/server/input/readInput';

const badRequest = 400;

export async function runFormCommand(
	request: Request,
	command: (input: RawInput) => Promise<string>
) {
	const input = rawInputOf(await request.formData());
	try {
		return { message: await command(input) };
	} catch (failure) {
		const problem = problemMessageOf(failure);
		if (problem === null) throw failure;
		return fail(badRequest, { problem });
	}
}
