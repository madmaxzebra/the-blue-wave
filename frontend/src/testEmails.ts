/** QA emails — excluded from public counter; may re-signup and always get welcome for testing. */
const TEST_SUBSCRIBER_EMAILS = new Set([
  'madmax.zebra@gmail.com',
  'madmax@zebra-onlinedesign.com',
  'bluenation@thebluewavefans.com',
]);

export function isTestSubscriberEmail(email: string): boolean {
  return TEST_SUBSCRIBER_EMAILS.has(email.trim().toLowerCase());
}
