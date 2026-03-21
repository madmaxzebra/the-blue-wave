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
// Prefer Gmail SMTP when configured – Resend with unverified domain only sends to account email
const useSmtpForSending = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
const useResend = !!process.env.RESEND_API_KEY && !useSmtpForSending;
const resend = useResend ? new resend_1.Resend(process.env.RESEND_API_KEY) : null;
const isGmail = process.env.SMTP_HOST === 'smtp.gmail.com';
const transporter = nodemailer_1.default.createTransport(isGmail
    ? { service: 'gmail', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
    : {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: false },
    });
async function testSmtpConnection() {
    if (useResend && resend) {
        return { ok: true }; // Resend uses HTTP - no verify needed
    }
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
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
function getFromAddress() {
    if (useResend && process.env.RESEND_FROM) {
        return process.env.RESEND_FROM;
    }
    if (useResend) {
        return '"The Blue Wave" <onboarding@resend.dev>';
    }
    return `"The Blue Wave" <${process.env.SMTP_USER}>`;
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
    const banner = getBannerAttachment();
    const imgSrc = siteOrigin ? `${siteOrigin.replace(/\/$/, '')}/email-banner.png` : null;
    const imgTag = imgSrc
        ? `<div style="text-align: center; margin-bottom: 1.5rem;"><img src="${imgSrc}" alt="The Blue Wave" style="max-width: 100%; height: auto;" /></div>`
        : banner ? `<div style="text-align: center; margin-bottom: 1.5rem;"><img src="cid:${BANNER_CID}" alt="The Blue Wave" style="max-width: 100%; height: auto;" /></div>` : '';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${imgTag}
      <h1 style="color: #0066CC;">Thank you for subscribing! 🌊</h1>
      <p>You're now part of The Blue Wave. We'll keep you updated on our FIFA World Cup 2026 initiative and exclusive content from Curaçao.</p>
      <p>Something special is on the horizon – stay tuned!</p>
      <p style="color: #666; font-size: 0.9em; margin-top: 2em;">
        © Zebra Productions – The Blue Wave · FIFA World Cup 2026
      </p>
    </div>
  `;
    if (useResend && resend) {
        const fromAddr = getFromAddress();
        const attachments = !imgSrc && banner ? [{ content: banner.content, filename: banner.filename, contentId: BANNER_CID }] : undefined;
        const adminBcc = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        try {
            const { data, error } = await resend.emails.send({
                from: fromAddr,
                to,
                bcc: adminBcc ? [adminBcc] : undefined,
                subject: 'Thank you for subscribing – The Blue Wave',
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
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[Mail] Mail not configured (no RESEND_API_KEY or SMTP), skipping welcome email');
        return { ok: false, error: 'Mail not configured' };
    }
    const attachments = !imgSrc && banner
        ? [{ filename: banner.filename, content: Buffer.from(banner.content, 'base64'), cid: BANNER_CID }]
        : [];
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    try {
        const info = await transporter.sendMail({
            from: getFromAddress(),
            to,
            bcc: adminEmail,
            subject: 'Thank you for subscribing – The Blue Wave',
            html,
            attachments,
        });
        const msgId = info.messageId || 'unknown';
        console.log(`[Mail] Welcome email sent to ${to} | messageId: ${msgId} (bcc: ${adminEmail || 'none'})`);
        return { ok: true };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const code = err instanceof Error ? err.code : '';
        console.error('[Mail] Error sending welcome email:', msg, code ? `(code: ${code})` : '');
        const hint = /invalid.*credentials|username.*password|authentication/i.test(msg) ? ' Use Gmail App Password from myaccount.google.com/apppasswords' : '';
        return { ok: false, error: msg + hint };
    }
}
async function sendAdminNotificationEmail(newSubscriberEmail, _siteOrigin) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
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
    if (useResend && resend) {
        const fromAddr = getFromAddress();
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
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[Mail] Mail not configured (no RESEND_API_KEY or SMTP), skipping admin notification');
        return false;
    }
    const attachments = banner
        ? [{ filename: banner.filename, content: Buffer.from(banner.content, 'base64'), cid: BANNER_CID }]
        : [];
    try {
        await transporter.sendMail({
            from: getFromAddress(),
            to: adminEmail,
            subject: `[The Blue Wave] New subscriber: ${newSubscriberEmail}`,
            html,
            attachments,
        });
        console.log(`[Mail] Admin notification sent to ${adminEmail}`);
        return true;
    }
    catch (err) {
        console.error('[Mail] Error sending admin notification:', err);
        return false;
    }
}
