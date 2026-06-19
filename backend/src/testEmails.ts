const DEFAULT_TEST_EMAILS =
  'madmax.zebra@gmail.com,madmax@zebra-onlinedesign.com,bluenation@thebluewavefans.com';

function parseTestEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw || DEFAULT_TEST_EMAILS)
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

const TEST_SUBSCRIBER_EMAILS = parseTestEmails(process.env.TEST_SUBSCRIBER_EMAILS);

export function normalizeSubscriberEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isTestSubscriberEmail(email: string): boolean {
  return TEST_SUBSCRIBER_EMAILS.has(normalizeSubscriberEmail(email));
}
