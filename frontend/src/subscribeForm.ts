import emailjs from '@emailjs/browser';
import { fetchWithTimeout, getApiBase } from './api';
import { resolveSubscriberCount, registerSubscriberCount } from './SubscriberCounter';
import {
  buildEmailJsMessage,
  buildSignupSuccessMessage,
  buildWelcomeEmailHtml,
  buildWelcomeEmailSubject,
  TEAM_NAME,
} from './welcomeContent';

const WEB3FORMS_TIMEOUT_MS = 8000;
const WELCOME_TIMEOUT_MS = 20000;
const SIGNUP_MAX_WAIT_MS = 8000;
const REGISTER_EXTRA_WAIT_MS = 20000;
const REGISTER_TIMEOUT_MS = 25000;
const MIN_LOADING_MS = 1500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Same keys as thebluewavefans static landing (Web3Forms + EmailJS fallback). */
const WEB3FORMS_ACCESS_KEY = '3b985545-14fc-41ad-8c00-aa913d628170';
const BLUEHOST_SUBSCRIBERS_URL =
  (import.meta.env.VITE_BLUEHOST_SUBSCRIBERS_URL as string | undefined)?.trim() ||
  'https://www.thebluewavefans.com/thebluewave-subscribers/register.php';
const BLUEHOST_WELCOME_URL =
  (import.meta.env.VITE_BLUEHOST_WELCOME_URL as string | undefined)?.trim() ||
  'https://www.thebluewavefans.com/thebluewave-subscribers/send-welcome.php';
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
      from_name: TEAM_NAME,
      team_name: TEAM_NAME,
      site_url: origin,
      subject: buildWelcomeEmailSubject(),
      message: buildEmailJsMessage(toEmail),
      html_message: buildWelcomeEmailHtml(toEmail, origin),
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
          from_name: TEAM_NAME,
          email,
          replyto: email,
          message: `New subscriber: ${email}\nSigned up: ${when}\nSource: thebluewavefans.com`,
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

async function sendViaBluehostWelcome(toEmail: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      BLUEHOST_WELCOME_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: toEmail }),
      },
      REGISTER_TIMEOUT_MS
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { welcomeSent?: boolean };
    return data.welcomeSent === true;
  } catch {
    return false;
  }
}

async function sendWelcomeEmail(toEmail: string, apiBase: string, origin: string): Promise<boolean> {
  // Bluehost uses Resend HTTP API (reliable). EmailJS quota is often exceeded.
  if (await sendViaBluehostWelcome(toEmail)) return true;
  if (await sendViaEmailJs(toEmail, origin)) return true;
  if (await sendViaRenderWelcome(toEmail, apiBase, origin)) return true;
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

async function registerOnBluehost(
  email: string
): Promise<{ count?: number; added?: boolean; welcomeSent?: boolean } | null> {
  try {
    const res = await fetchWithTimeout(
      BLUEHOST_SUBSCRIBERS_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      },
      REGISTER_TIMEOUT_MS
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      count?: number;
      subscriberCount?: number;
      added?: boolean;
      welcomeSent?: boolean;
    };
    const count = data.count ?? data.subscriberCount;
    if (typeof count !== 'number') return null;
    return { count, added: data.added === true, welcomeSent: data.welcomeSent === true };
  } catch {
    return null;
  }
}

/** Wait for signup work (with a cap) so the form can show progress messages. */
export async function submitStayUpdatedSignup(
  email: string,
  options?: { botcheck?: boolean }
): Promise<StayUpdatedResult> {
  const trimmed = email.trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.thebluewavefans.com';
  const apiBase = getApiBase();
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/Curacao' });
  const started = Date.now();

  void (async () => {
    const web3Ok = await tryWeb3FormsAdminAlert(trimmed, when, options?.botcheck);
    if (!web3Ok) await sendAdminViaRender(trimmed, apiBase, origin);
  })();

  let registerResult: { count?: number; added?: boolean; welcomeSent?: boolean } | null = null;
  let welcomeSent = false;

  const registerPromise = Promise.all([
    registerOnBluehost(trimmed),
    registerSubscriberCount(trimmed),
  ]).then(([bluehost, render]) => {
    const merged = render ?? bluehost;
    return {
      count: merged?.count,
      added: merged?.added ?? bluehost?.added ?? false,
      welcomeSent: bluehost?.welcomeSent === true,
    };
  });

  await Promise.race([registerPromise, sleep(SIGNUP_MAX_WAIT_MS)]);

  registerResult = await Promise.race([registerPromise, sleep(REGISTER_EXTRA_WAIT_MS)]);

  if (registerResult?.welcomeSent) {
    welcomeSent = true;
  } else {
    welcomeSent = await sendWelcomeEmail(trimmed, apiBase, origin);
  }

  const elapsed = Date.now() - started;
  if (elapsed < MIN_LOADING_MS) {
    await sleep(MIN_LOADING_MS - elapsed);
  }

  let subscriberCount = registerResult?.count;
  let subscriberAdded = registerResult?.added ?? false;
  if (subscriberCount === undefined) {
    const resolved = await resolveSubscriberCount();
    subscriberCount = resolved > 0 ? resolved : undefined;
    subscriberAdded = false;
  }

  return {
    ok: true,
    welcomeSent,
    subscriberCount,
    subscriberAdded,
    message: buildSignupSuccessMessage(trimmed, welcomeSent),
  };
}
