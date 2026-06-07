import emailjs from '@emailjs/browser';
import { getApiBase } from './api';
import { registerSubscriberCount } from './SubscriberCounter';

/** Same keys as thebluewavefans static landing (Web3Forms + EmailJS fallback). */
const WEB3FORMS_ACCESS_KEY = '3b985545-14fc-41ad-8c00-aa913d628170';
const EMAILJS_PUBLIC_KEY = '_C-hi1wJ-CaXzjmNh';
const EMAILJS_SERVICE_ID = 'service_hz836sp';
const EMAILJS_TEMPLATE_ID = 'template_ax3qxyy';

let emailjsReady = false;

function initEmailJs(): boolean {
  if (emailjsReady) return true;
  if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.startsWith('YOUR_')) return false;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  emailjsReady = true;
  return true;
}

async function sendWelcomeEmail(toEmail: string, apiBase: string, origin: string): Promise<boolean> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (apiBase.includes('loca.lt')) {
    headers['bypass-tunnel-reminder'] = '1';
  }

  try {
    const res = await fetch(`${apiBase}/api/subscribe`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: toEmail,
        origin,
        welcomeOnly: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (
      res.ok &&
      data.ok &&
      typeof data.message === 'string' &&
      data.message.includes('Check your inbox')
    ) {
      return true;
    }
  } catch {
    /* fall through to EmailJS */
  }

  if (!initEmailJs()) return false;
  if (EMAILJS_SERVICE_ID.startsWith('YOUR_') || EMAILJS_TEMPLATE_ID.startsWith('YOUR_')) {
    return false;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      email: toEmail,
      to_email: toEmail,
      reply_to: 'madmax.zebra@gmail.com',
    });
    return true;
  } catch {
    return false;
  }
}

export type StayUpdatedResult =
  | { ok: true; welcomeSent: boolean; message: string; subscriberCount?: number }
  | { ok: false; message: string };

/** Matches the old thebluewavefans.com static form: Web3Forms alert + welcome via API/EmailJS. */
export async function submitStayUpdatedSignup(
  email: string,
  options?: { botcheck?: boolean }
): Promise<StayUpdatedResult> {
  const trimmed = email.trim();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.thebluewavefans.com';
  const apiBase = getApiBase();
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/Curacao' });

  const web3Res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `The Blue Wave signup — ${trimmed} (${when})`,
      from_name: 'The Blue Wave (thebluewavefans.com)',
      email: trimmed,
      replyto: trimmed,
      message:
        'Legitimate signup notification from thebluewavefans.com\n\n' +
        `Subscriber email: ${trimmed}\n` +
        `Signed up: ${when}\n` +
        'Source: Stay Updated form on https://thebluewavefans.com\n\n' +
        'Reply to this email to reach the subscriber directly.',
      botcheck: options?.botcheck ?? false,
    }),
  });

  const web3Data = await web3Res.json().catch(() => ({}));
  if (!web3Res.ok || !web3Data.success) {
    return {
      ok: false,
      message:
        typeof web3Data.message === 'string'
          ? web3Data.message
          : 'Something went wrong — please try again.',
    };
  }

  const welcomeSent = await sendWelcomeEmail(trimmed, apiBase, origin);
  const subscriberCount = (await registerSubscriberCount(trimmed)) ?? undefined;
  return {
    ok: true,
    welcomeSent,
    subscriberCount,
    message: welcomeSent
      ? "Thanks! You're on the list — check your inbox (and spam folder just in case). 🌊"
      : "Thanks! You're on the list — we'll email you soon. 🌊",
  };
}
