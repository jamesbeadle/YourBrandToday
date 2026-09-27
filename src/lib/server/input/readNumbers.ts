import { InputProblem } from './inputProblem';
import type { RawInput } from './readInput';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const largestCount = 2_147_483_647;
const largestAmountInPounds = 10_000_000;
const penceInAPound = 100;

export function readWholeNumber(input: RawInput, field: string, label: string, range: [number, number]): number {
	const raw = input[field];
	const number = Number(raw);
	const [lowest, highest] = range;
	const isBlank = raw === undefined || raw === null || String(raw).trim() === '';
	if (isBlank || !Number.isInteger(number) || number < lowest || number > highest) {
		throw new InputProblem(`The ${label} is a whole number from ${lowest} to ${highest}.`);
	}
	return number;
}

export function readCount(input: RawInput, field: string, label: string): number {
	if (input[field] === undefined || String(input[field]).trim() === '') return 0;
	return readWholeNumber(input, field, label, [0, largestCount]);
}

export function readIsoDate(input: RawInput, field: string, label: string): string {
	const text = String(input[field] ?? '').trim();
	if (!isoDatePattern.test(text) || Number.isNaN(Date.parse(text))) {
		throw new InputProblem(`The ${label} is a date written YYYY-MM-DD.`);
	}
	return text;
}

export function readPounds(input: RawInput, field: string, label: string): number {
	const pounds = Number(input[field]);
	if (!Number.isFinite(pounds) || pounds < 0 || pounds > largestAmountInPounds) {
		throw new InputProblem(`The ${label} is an amount in pounds up to ${largestAmountInPounds}.`);
	}
	return Math.round(pounds * penceInAPound);
}
