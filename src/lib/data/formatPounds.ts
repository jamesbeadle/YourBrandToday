const penceInAPound = 100;

const poundFormat = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function formatPounds(pence: number): string {
	return poundFormat.format(pence / penceInAPound);
}
