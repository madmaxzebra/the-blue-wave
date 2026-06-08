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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function sendViaEmailJs(toEmail: string, origin: string): Promise<boolean> {
  if (!initEmailJs()) return false;
  if (EMAILJS_SERVICE_ID.startsWith('YOUR_') || EMAILJS_TEMPLATE_ID.startsWith('YOUR_')) {
    return false;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      email: toEmail,
      to_email: toEmail,
      user_email: toEmail,
      reply_to: 'madmax.zebra@gmail.com',
      from_name: 'The Blue Wave',
      site_url: origin,
      message:
        'Thank you for joining The Blue Wave! We will keep you updated on FIFA World Cup 2026 and our magazine from Curaçao.',
    });
    return true;
  } catch {
    return false;
  }
}

async function sendViaRenderWelcome(
  toEmail: string,
  apiBase: string,
  origin: string
): Promise<boolean> {
  if (!apiBase) return false;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (apiBase.includes('loca.lt')) {
    headers['bypass-tunnel-reminder'] = '1';
  }

  try {
    const res = await fetch(`${apiBase}/api/welcome`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: toEmail, origin }),
    });
    const text = await res.text();
    if (text.trimStart().startsWith('<!')) return false;
    const data = text ? JSON.parse(text) : {};
    return res.ok && data.ok === true;
  } catch {
    return false;
  }
}

/**
 * Welcome email: EmailJS first (works without Render mail), then Render API as backup.
 * Retries EmailJS once — helps on mobile networks.
 */
async function sendWelcomeEmail(toEmail: string, apiBase: string, origin: string): Promise<boolean> {
  if (await sendViaEmailJs(toEmail, origin)) return true;

  const renderOk = await sendViaRenderWelcome(toEmail, apiBase, origin);
  if (renderOk) return true;

  await sleep(900);
  if (await sendViaEmailJs(toEmail, origin)) return true;

  return sendViaRenderWelcome(toEmail, apiBase, origin);
}

export type StayUpdatedResult =
  | {
      ok: true;
      welcomeSent: boolean;
      message: string;
      subscriberCount?: number;
      subscriberAdded?: boolean;
    }
  | { ok: false; message: string };

/** Web3Forms admin alert + global counter + welcome via EmailJS / Render. */
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

  const [registration, welcomeSent] = await Promise.all([
    registerSubscriberCount(trimmed),
    sendWelcomeEmail(trimmed, apiBase, origin),
  ]);

  return {
    ok: true,
    welcomeSent,
    subscriberCount: registration?.count,
    subscriberAdded: registration?.added ?? false,
    message: welcomeSent
      ? "Thanks! You're on the list — check your inbox (and spam folder just in case). 🌊"
      : "Thanks! You're on the list. If no email arrives in a few minutes, check spam or try again. 🌊",
  };
}
