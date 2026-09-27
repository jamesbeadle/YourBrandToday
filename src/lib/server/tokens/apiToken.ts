const bearerPrefix = 'bearer ';

export function bearerToken(request: Request): string {
	const header = request.headers.get('authorization') ?? '';
	if (!header.toLowerCase().startsWith(bearerPrefix)) return '';
	return header.slice(bearerPrefix.length).trim();
}
