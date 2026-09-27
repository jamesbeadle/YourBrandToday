import { env } from '$env/dynamic/private';
import {
	enquiryNotificationSubject,
	renderEnquiryNotificationEmail
} from '$lib/server/email/enquiryNotificationEmail';
import { sendTransactionalEmail, type EmailDelivery } from '$lib/server/email/sendTransactionalEmail';
import type { WebsiteEnquiry } from '$lib/data/enquiryForm';

export async function notifyEnquiryReceived(
	enquiry: WebsiteEnquiry,
	clientUrl: string
): Promise<EmailDelivery> {
	if (!env.ENQUIRY_NOTIFICATION_EMAIL) return 'skipped';
	return sendTransactionalEmail({
		to: env.ENQUIRY_NOTIFICATION_EMAIL,
		subject: enquiryNotificationSubject(enquiry),
		html: renderEnquiryNotificationEmail(enquiry, clientUrl)
	});
}
