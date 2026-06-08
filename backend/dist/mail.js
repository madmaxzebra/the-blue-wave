"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSmtpConnection = testSmtpConnection;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendAdminNotificationEmail = sendAdminNotificationEmail;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const resend_1 = require("resend");
const env_1 = require("./env");
// Prefer Gmail SMTP when configured; fall back to Resend if SMTP fails.
const smtpUser = (0, env_1.getSmtpUser)();
const smtpPass = (0, env_1.getSmtpPass)();
const hasSmtp = (0, env_1.hasSmtpConfig)();
const hasResend = (0, env_1.hasResendConfig)();
const resend = hasResend ? new resend_1.Resend((0, env_1.getResendApiKey)()) : null;
const smtpHost = (0, env_1.getSmtpHost)();
const smtpPort = (0, env_1.getSmtpPort)();
const isGmail = smtpHost === 'smtp.gmail.com';
const transporter = nodemailer_1.default.createTransport(isGmail
    ? { service: 'gmail', auth: { user: smtpUser, pass: smtpPass } }
    : {
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
    });
async function testSmtpConnection() {
    if (hasResend) {
        return { ok: true };
    }
    if (!hasSmtp) {
        return { ok: false, error: 'Mail not configured. Set RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env' };
    }
    try {
        await transporter.verify();
        return { ok: true };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Mail] SMTP verify failed:', err);
        return { ok: false, error: msg };
    }
}
function getFromAddress(viaResend) {
    if (viaResend && process.env.RESEND_FROM) {
        return process.env.RESEND_FROM;
    }
    if (viaResend) {
        return '"The Blue Wave" <onboarding@resend.dev>';
    }
    return `"The Blue Wave" <${smtpUser}>`;
}
function getReplyToAddress() {
    return process.env.REPLY_TO || (0, env_1.getAdminEmail)() || smtpUser || '';
}
function resolveSiteOrigin(siteOrigin) {
    const raw = siteOrigin || (0, env_1.getSiteUrl)();
    return raw.replace(/\/$/, '');
}
const BANNER_CID = 'banner-image';
function getBannerAttachment() {
    const bannerPath = path_1.default.join(__dirname, '..', 'assets', 'email-banner.png');
    try {
        if (fs_1.default.existsSync(bannerPath)) {
            const content = fs_1.default.readFileSync(bannerPath).toString('base64');
            return {
                content,
                filename: 'email-banner.png',
                contentId: BANNER_CID,
                contentType: 'image/png',
            };
        }
    }
    catch {
        console.warn('[Mail] Banner image not found at', bannerPath);
    }
    return null;
}
async function sendWelcomeEmail(to, siteOrigin) {
    const site = resolveSiteOrigin(siteOrigin);
    const banner = getBannerAttachment();
    const logoUrl = `${site}/bluewavelogo.png`;
    const bannerUrl = `${site}/email-banner.png`;
    const imgSrc = bannerUrl;
    const imgTag = `<div style="text-align: center; margin-bottom: 1.5rem;"><img src="${logoUrl}" alt="The Blue Wave" width="160" style="max-width: 160px; height: auto;" /></div>`;
    const subject = 'You\'re on the list — The Blue Wave (World Cup 2026)';
    const text = [
        'Thank you for signing up at thebluewavefans.com',
        '',
        'You\'re now part of The Blue Wave. We\'ll keep you updated on our FIFA World Cup 2026 initiative and exclusive content from Curaçao.',
        '',
        'Something special is on the horizon — stay tuned!',
        '',
        `Visit us: ${site}`,
        '',
        '© Zebra Productions — The Blue Wave · FIFA World Cup 2026',
    ].join('\n');
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      ${imgTag}
      <h1 style="color: #0066CC; font-size: 22px;">Thank you for signing up</h1>
      <p>You signed up at <a href="${site}">thebluewavefans.com</a>. You're now part of The Blue Wave.</p>
      <p>We'll keep you updated on our FIFA World Cup 2026 initiative and exclusive content from Curaçao.</p>
      <p>Something special is on the horizon — stay tuned!</p>
      <p style="margin-top: 24px;"><a href="${site}" style="color: #0066CC;">Visit The Blue Wave</a></p>
      <p style="color: #666; font-size: 0.9em; margin-top: 2em;">
        © Zebra Productions — The Blue Wave · FIFA World Cup 2026
      </p>
    </div>
  `;
    const replyTo = getReplyToAddress();
    if (hasSmtp) {
        const smtpAttachments = !imgSrc && banner
            ? [{ filename: banner.filename, content: Buffer.from(banner.content, 'base64'), cid: BANNER_CID }]
            : [];
        try {
            const info = await transporter.sendMail({
                from: getFromAddress(false),
                to,
                replyTo: replyTo || undefined,
                subject,
                text,
                html,
                attachments: smtpAttachments,
            });
            const msgId = info.messageId || 'unknown';
            console.log(`[Mail] Welcome email sent to ${to} (SMTP) | messageId: ${msgId}`);
            return { ok: true };
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn('[Mail] SMTP welcome failed, trying Resend fallback:', msg);
            if (!hasResend || !resend) {
                const hint = /invalid.*credentials|username.*password|authentication/i.test(msg)
                    ? ' Create a new Gmail App Password: myaccount.google.com/apppasswords'
                    : '';
                return { ok: false, error: msg + hint };
            }
        }
    }
    if (hasResend && resend) {
        const fromAddr = getFromAddress(true);
        const attachments = !imgSrc && banner ? [{ content: banner.content, filename: banner.filename, contentId: BANNER_CID }] : undefined;
        try {
            const { data, error } = await resend.emails.send({
                from: fromAddr,
                to,
                replyTo: replyTo || undefined,
                subject,
                text,
                html,
                attachments,
            });
            if (error) {
                console.error('[Mail] Resend error:', JSON.stringify(error), '- Verify domain in Resend dashboard');
                return { ok: false, error: JSON.stringify(error) };
            }
            console.log(`[Mail] Welcome email sent to ${to} (Resend)`, data?.id);
            return { ok: true };
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error('[Mail] Error sending welcome email:', err);
            return { ok: false, error: msg };
        }
    }
    console.warn('[Mail] Mail not configured (no RESEND_API_KEY or SMTP), skipping welcome email');
    return { ok: false, error: 'Mail not configured' };
}
async function sendAdminNotificationEmail(newSubscriberEmail, _siteOrigin) {
    const adminEmail = (0, env_1.getAdminEmail)() || smtpUser;
    if (!adminEmail) {
        console.warn('[Mail] ADMIN_EMAIL not configured, skipping admin notification');
        return false;
    }
    const banner = getBannerAttachment();
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      ${banner ? `<div style="text-align: center; margin-bottom: 1rem;"><img src="cid:${BANNER_CID}" alt="The Blue Wave" style="max-width: 100%; height: auto;" /></div>` : ''}
      <h2 style="color: #0066CC;">New subscription 🌊</h2>
      <p>A new person has subscribed to The Blue Wave:</p>
      <p style="font-size: 1.2em; font-weight: bold;">${newSubscriberEmail}</p>
      <p style="color: #666; font-size: 0.9em;">© Zebra Productions – The Blue Wave</p>
    </div>
  `;
    if (hasSmtp) {
        const smtpAttachments = banner
            ? [{ filename: banner.filename, content: Buffer.from(banner.content, 'base64'), cid: BANNER_CID }]
            : [];
        try {
            await transporter.sendMail({
                from: getFromAddress(false),
                to: adminEmail,
                subject: `[The Blue Wave] New subscriber: ${newSubscriberEmail}`,
                html,
                attachments: smtpAttachments,
            });
            console.log(`[Mail] Admin notification sent to ${adminEmail} (SMTP)`);
            return true;
        }
        catch (err) {
            console.warn('[Mail] SMTP admin notification failed, trying Resend:', err);
            if (!hasResend || !resend)
                return false;
        }
    }
    if (hasResend && resend) {
        const fromAddr = getFromAddress(true);
        const attachments = banner ? [{ content: banner.content, filename: banner.filename, contentId: BANNER_CID }] : undefined;
        try {
            const { data, error } = await resend.emails.send({
                from: fromAddr,
                to: adminEmail,
                subject: `[The Blue Wave] New subscriber: ${newSubscriberEmail}`,
                html,
                attachments,
            });
            if (error) {
                console.error('[Mail] Resend error (admin):', JSON.stringify(error));
                return false;
            }
            console.log(`[Mail] Admin notification sent to ${adminEmail} (Resend)`, data?.id);
            return true;
        }
        catch (err) {
            console.error('[Mail] Error sending admin notification:', err);
            return false;
        }
    }
    console.warn('[Mail] Mail not configured, skipping admin notification');
    return false;
}
