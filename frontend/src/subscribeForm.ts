import emailjs from '@emailjs/browser';
import { fetchWithTimeout, getApiBase } from './api';
import { registerSubscriberCount } from './SubscriberCounter';

const WEB3FORMS_TIMEOUT_MS = 10000;
const WELCOME_TIMEOUT_MS = 12000;
const POST_SIGNUP_MAX_WAIT_MS = 15000;

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

function apiHeaders(apiBase: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (apiBase.includes('loca.lt')) {
    headers['bypass-tunnel-reminder'] = '1';
  }
  return headers;
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

  try {
    const res = await fetchWithTimeout(
      `${apiBase}/api/welcome`,
      {
        method: 'POST',
        headers: apiHeaders(apiBase),
        body: JSON.stringify({ email: toEmail, origin }),
      },
      WELCOME_TIMEOUT_MS
    );
    const text = await res.text();
    if (text.trimStart().startsWith('<!')) return false;
    const data = text ? JSON.parse(text) : {};
    return res.ok && data.ok === true;
  } catch {
    return false;
  }
}

async function sendAdminViaRender(
  toEmail: string,
  apiBase: string,
  origin: string
): Promise<boolean> {
  if (!apiBase) return false;

  try {
    const res = await fetchWithTimeout(
      `${apiBase}/api/subscribe`,
      {
        method: 'POST',
        headers: apiHeaders(apiBase),
        body: JSON.stringify({ email: toEmail, origin, adminOnly: true }),
      },
      WELCOME_TIMEOUT_MS
    );
    const text = await res.text();
    if (text.trimStart().startsWith('<!')) return false;
    const data = text ? JSON.parse(text) : {};
    return res.ok && data.ok !== false;
  } catch {
    return false;
  }
}

/**
 * Optional Web3Forms admin alert — never blocks signup (spam filter often rejects legit signups).
 */
async function tryWeb3FormsAdminAlert(
  email: string,
  when: string,
  botcheck?: boolean
): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `The Blue Wave signup — ${email} (${when})`,
          from_name: 'The Blue Wave',
          email,
          replyto: email,
          message:
            `New subscriber: ${email}\nSigned up: ${when}\nSource: thebluewavefans.com`,
          botcheck: botcheck ?? false,
        }),
      },
      WEB3FORMS_TIMEOUT_MS
    );
    const data = await res.json().catch(() => ({}));
    return res.ok && data.success === true;
  } catch {
    return false;
  }
}

async function sendWelcomeEmail(toEmail: string, apiBase: string, origin: string): Promise<boolean> {
  if (await sendViaRenderWelcome(toEmail, apiBase, origin)) return true;
  if (await sendViaEmailJs(toEmail, origin)) return true;
  return false;
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

/** Render welcome + counter; Web3Forms admin alert is optional backup only. */
export async function submitStayUpdatedSignup(
  email: string,
  options?: { botcheck?: boolean }
): Promise<StayUpdatedResult> {
  const trimmed = email.trim();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.thebluewavefans.com';
  const apiBase = getApiBase();
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/Curacao' });

  const web3Ok = await tryWeb3FormsAdminAlert(trimmed, when, options?.botcheck);

  type PostSignup = [Awaited<ReturnType<typeof registerSubscriberCount>>, boolean, boolean];
  const postSignup = Promise.all([
    registerSubscriberCount(trimmed),
    sendWelcomeEmail(trimmed, apiBase, origin),
    web3Ok ? Promise.resolve(true) : sendAdminViaRender(trimmed, apiBase, origin),
  ]) as Promise<PostSignup>;

  const finished = await Promise.race<PostSignup | null>([
    postSignup,
    sleep(POST_SIGNUP_MAX_WAIT_MS).then(() => null),
  ]);

  if (!finished) {
    void postSignup;
    return {
      ok: true,
      welcomeSent: false,
      message:
        "Thanks! You're on the list — your welcome email is on the way (check inbox and spam). 🌊",
    };
  }

  const [registration, welcomeSent] = finished;

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
