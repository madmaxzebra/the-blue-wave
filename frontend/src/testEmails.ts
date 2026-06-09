/** QA emails — may re-register and always count as a new signup for testing. */
const TEST_SUBSCRIBER_EMAILS = new Set([
  'madmax.zebra@gmail.com',
  'madmax@zebra-onlinedesign.com',
]);

export function isTestSubscriberEmail(email: string): boolean {
  return TEST_SUBSCRIBER_EMAILS.has(email.trim().toLowerCase());
}
