import { fail } from '@sveltejs/kit';
import { addressRateLimit } from '$lib/server/http/addressRateLimit';
import { notifyEnquiryReceived } from '$lib/server/enquiries/notifyEnquiryReceived';
import { readWebsiteEnquiry } from '$lib/server/enquiries/websiteEnquiry';
import { companyDetails } from '$lib/data/companyDetails';
import type { Actions } from './$types';

const deliveryFailedMessage = `We could not send your message just now — please email ${companyDetails.contactEmail} instead.`;
const tenMinutesInMilliseconds = 10 * 60 * 1000;
const enquiriesPerAddress = addressRateLimit({
	allowance: 5,
	windowMilliseconds: tenMinutesInMilliseconds
});

export const actions: Actions = {
	sendEnquiry: async ({ request, url, getClientAddress }) => {
		const reading = readWebsiteEnquiry(await request.formData());
		if ('isHoneypotFilled' in reading) return { isSent: true };
		if ('problem' in reading) return fail(400, { message: reading.problem });
		if (!enquiriesPerAddress.isAllowedFrom(getClientAddress())) return { isSent: true };
		try {
			await notifyEnquiryReceived(reading.enquiry, url.origin);
		} catch {
			return fail(500, { message: deliveryFailedMessage });
		}
		return { isSent: true };
	}
};
