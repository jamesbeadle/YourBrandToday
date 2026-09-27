export type WebsiteEnquiry = {
	name: string;
	email: string;
	company: string;
	website: string;
	message: string;
};

export const enquiryFieldLimits: Record<keyof WebsiteEnquiry, number> = {
	name: 120,
	email: 254,
	company: 120,
	website: 200,
	message: 2000
};

export const enquiryHoneypotField = 'nickname';
