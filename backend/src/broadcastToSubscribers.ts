import { getRealSubscriberStats } from './db';
import { sendBroadcastEmail } from './mail';
import { plainTextToHtml } from './broadcastContent';
import { getSiteUrl } from './env';

const SEND_DELAY_MS = 350;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type BroadcastResult = {
  ok: boolean;
  dryRun: boolean;
  recipientCount: number;
  sent: number;
  failed: number;
  failures: Array<{ email: string; error: string }>;
};

export async function broadcastToSubscribers(options: {
  subject: string;
  message: string;
  dryRun?: boolean;
}): Promise<BroadcastResult> {
  const subject = options.subject.trim();
  const message = options.message.trim();
  const stats = getRealSubscriberStats();
  const recipients = stats.subscribers.map((row) => row.email);

  if (!subject || !message) {
    return {
      ok: false,
      dryRun: Boolean(options.dryRun),
      recipientCount: recipients.length,
      sent: 0,
      failed: 0,
      failures: [{ email: '', error: 'Subject and message are required' }],
    };
  }

  if (options.dryRun) {
    return {
      ok: true,
      dryRun: true,
      recipientCount: recipients.length,
      sent: 0,
      failed: 0,
      failures: [],
    };
  }

  const messageHtml = plainTextToHtml(message);
  const site = getSiteUrl();
  let sent = 0;
  const failures: Array<{ email: string; error: string }> = [];

  for (const email of recipients) {
    const result = await sendBroadcastEmail(email, subject, messageHtml, message, site);
    if (result.ok) {
      sent += 1;
    } else {
      failures.push({ email, error: result.error || 'Send failed' });
    }
    if (SEND_DELAY_MS > 0) {
      await sleep(SEND_DELAY_MS);
    }
  }

  return {
    ok: failures.length === 0,
    dryRun: false,
    recipientCount: recipients.length,
    sent,
    failed: failures.length,
    failures: failures.slice(0, 20),
  };
}
