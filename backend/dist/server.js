"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
// Load .env - try multiple paths (backend/, cwd, cwd/backend) and override any existing vars
const envPaths = [
    path_1.default.join(__dirname, '..', '.env'),
    path_1.default.join(process.cwd(), '.env'),
    path_1.default.join(process.cwd(), 'backend', '.env'),
];
let loadedFrom = '';
for (const envPath of envPaths) {
    const result = (0, dotenv_1.config)({ path: envPath, override: true });
    if (!result.error) {
        loadedFrom = envPath;
        break;
    }
    const err = result.error;
    if (err?.code !== 'ENOENT') {
        console.warn('[Blue Wave] .env load failed:', envPath, result.error?.message);
    }
}
if (process.env.NODE_ENV !== 'production') {
    if (loadedFrom) {
        console.log('[Blue Wave] Loaded .env from', loadedFrom, '| RESEND_API_KEY:', !!process.env.RESEND_API_KEY);
    }
    else {
        console.warn('[Blue Wave] No .env found. Tried:', envPaths);
    }
}
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const mail_1 = require("./mail");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '5mb' }));
/** Full URL to WK Magazine web app (optionally include a path, e.g. …/documents/1). */
const MAGAZINE_URL = (process.env.MAGAZINE_URL ||
    process.env.MAGAZINE_SITE_URL ||
    'http://localhost:5173').replace(/\/$/, '');
const FLIPSNACK_URL = (process.env.FLIPSNACK_URL ||
    'https://www.flipsnack.com/AD66C5D9E8C/wk-magazine-alfa-1-4-annimated').replace(/\/$/, '');
const MANUS_API_URL = (process.env.MANUS_API_URL || '').replace(/\/$/, '');
const SUBSCRIBER_COUNT_BASE = Number.parseInt(process.env.SUBSCRIBER_COUNT_BASE ?? '4732', 10);
function getDisplaySubscriberCount() {
    const base = Number.isFinite(SUBSCRIBER_COUNT_BASE) ? SUBSCRIBER_COUNT_BASE : 4732;
    return base + (0, db_1.getSubscriberCount)();
}
app.get('/api/health', (req, res) => {
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    const usesManus = !!MANUS_API_URL;
    const mailConfigured = hasResend || hasSmtp || usesManus;
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Health] mailConfigured:', mailConfigured, '| resend:', hasResend, '| smtp:', hasSmtp);
    }
    res.json({ ok: true, resendConfigured: mailConfigured });
});
app.post('/api/test-email', async (req, res) => {
    const email = req.body?.email?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    try {
        const conn = await (0, mail_1.testSmtpConnection)();
        if (!conn.ok) {
            return res.status(500).json({ ok: false, message: conn.error });
        }
        const send = await (0, mail_1.sendWelcomeEmail)(email);
        if (!send.ok) {
            return res.json({ ok: false, message: send.error || 'Mail failed. See MAIL-SETUP.md' });
        }
        res.json({ ok: true, message: 'Test email sent!' });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Test failed';
        console.error('[Test-email]', err);
        res.status(500).json({ ok: false, message: msg });
    }
});
app.get('/api/stats', (_req, res) => {
    try {
        const count = getDisplaySubscriberCount();
        res.json({ subscribers: count });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});
app.get('/api/subscriber-count', (_req, res) => {
    try {
        res.json({ count: getDisplaySubscriberCount() });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get subscriber count' });
    }
});
app.post('/api/register-subscriber', (req, res) => {
    const email = req.body?.email?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    try {
        const { added } = (0, db_1.addSubscriber)(email, req.body?.referralCode);
        res.json({ ok: true, count: getDisplaySubscriberCount(), added });
    }
    catch (err) {
        console.error('[Register-subscriber]', err);
        res.status(500).json({ error: 'Failed to register subscriber' });
    }
});
app.get('/api/mail-status', (_req, res) => {
    const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasManus = !!process.env.MANUS_API_URL;
    const mailConfigured = hasSmtp || hasResend || hasManus;
    const method = hasManus ? 'manus' : hasSmtp ? 'smtp' : hasResend ? 'resend' : 'none';
    res.json({ mailConfigured, method, hasSmtp, hasResend, hasManus });
});
app.get('/api/mail-check', (_req, res) => {
    const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    const hasResend = !!process.env.RESEND_API_KEY;
    const mailOk = hasSmtp || hasResend;
    const hint = !mailOk
        ? 'Add SMTP_USER/SMTP_PASS or RESEND_API_KEY in Render → Environment Variables, then redeploy.'
        : hasSmtp
            ? 'SMTP configured. Use Gmail App Password (not normal password): myaccount.google.com/apppasswords'
            : 'Resend configured. Verify domain at resend.com/domains if emails fail.';
    const html = `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><title>Mail Check</title></head>
    <body style="font-family: Arial; padding: 2rem; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #0066CC;">Blue Wave – Mail Check</h1>
      <p style="font-size: 1.2em;">
        <strong>Mail configured:</strong>
        <span style="color: ${mailOk ? 'green' : 'red'}; font-weight: bold;">${mailOk ? 'YES ✓' : 'NO ✗'}</span>
        ${hasSmtp ? '(SMTP/Gmail)' : hasResend ? '(Resend)' : ''}
      </p>
      <p style="color: #666;">${hint}</p>
    </body></html>
  `;
    res.type('html').send(html);
});
/** Welcome-only endpoint for thebluewavefans.com static form (Web3Forms handles admin alerts). */
app.post('/api/welcome', async (req, res) => {
    const email = req.body?.email?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    try {
        const siteOrigin = req.body?.origin || process.env.SITE_URL || 'https://thebluewavefans.com';
        const result = await (0, mail_1.sendWelcomeEmail)(email, siteOrigin);
        if (!result.ok) {
            console.warn('[Welcome] Failed for', email, result.error || '');
            return res.status(500).json({ ok: false, error: result.error || 'Welcome email failed' });
        }
        console.log('[Welcome] Sent to', email);
        res.json({ ok: true });
    }
    catch (err) {
        console.error('[Welcome] Error:', err);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});
app.post('/api/subscribe', async (req, res) => {
    const email = req.body?.email?.trim();
    console.log('[Subscribe] Request for:', email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    try {
        if (MANUS_API_URL) {
            const manRes = await fetch(`${MANUS_API_URL}/api/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BlueWave-Proxy/1.0',
                },
                body: JSON.stringify({
                    email,
                    referralCode: req.body?.referralCode,
                    origin: MANUS_API_URL,
                }),
            });
            const text = await manRes.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            }
            catch {
                data = { error: text || 'Manus request failed' };
            }
            if (manRes.ok) {
                console.log('[Subscribe] Proxied to Manus – welcome/confirmation sent by them');
                return res.status(200).json(data.ok !== false ? { ok: true, message: data.message || 'Thanks! Check your inbox.' } : data);
            }
            if (manRes.status === 409 || (data.error && /already|ingeschreven|subscribed/i.test(String(data.error)))) {
                return res.json({ ok: true, message: 'Thanks! We\'ll send the confirmation email shortly.' });
            }
            return res.status(manRes.status).json(data);
        }
        const { added } = (0, db_1.addSubscriber)(email, req.body?.referralCode);
        if (req.body?.countOnly === true) {
            return res.json({
                ok: true,
                count: getDisplaySubscriberCount(),
                subscriberCount: getDisplaySubscriberCount(),
                added,
            });
        }
        const siteOrigin = req.body?.origin || process.env.SITE_URL;
        const welcomeOnly = req.body?.welcomeOnly === true;
        const [welcomeResult, adminSent] = await Promise.all([
            (0, mail_1.sendWelcomeEmail)(email, siteOrigin),
            welcomeOnly ? Promise.resolve(true) : (0, mail_1.sendAdminNotificationEmail)(email, siteOrigin),
        ]);
        const welcomeSent = welcomeResult.ok;
        if (welcomeSent) {
            console.log('[Subscribe] Welcome email sent to', email);
        }
        else {
            console.warn('[Subscribe] Welcome email FAILED for', email, welcomeResult.error || '');
        }
        if (!adminSent) {
            console.warn('[Subscribe] Admin notification not sent - check ADMIN_EMAIL in .env');
        }
        const msg = welcomeSent
            ? 'Thanks! Check your inbox for the confirmation. If you don’t see it, check your spam folder.'
            : 'Thanks for subscribing! Email failed – use Gmail App Password in backend/.env (see MAIL-SETUP.md)';
        res.json({
            ok: true,
            message: msg,
            subscriberCount: getDisplaySubscriberCount(),
            added,
        });
    }
    catch (err) {
        console.error('[Subscribe] Error:', err);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});
app.get('/api/magazine-url', (_req, res) => res.json({ url: MAGAZINE_URL }));
app.get('/api/flipsnack-url', (_req, res) => res.json({ url: FLIPSNACK_URL }));
// Community feed
app.get('/api/community/posts', (_req, res) => {
    try {
        const posts = (0, db_1.getPosts)();
        res.json({ posts });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load posts' });
    }
});
app.post('/api/community/posts', (req, res) => {
    const author = req.body?.author?.trim();
    const content = req.body?.content?.trim();
    const photoData = req.body?.photoData;
    if (!content || content.length < 1) {
        return res.status(400).json({ error: 'Content is required' });
    }
    try {
        const { id } = (0, db_1.addPost)(author, content, photoData);
        res.json({ ok: true, id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post' });
    }
});
app.get('/api/community/posts/:id/comments', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))
        return res.status(400).json({ error: 'Invalid post id' });
    try {
        const comments = (0, db_1.getComments)(id);
        res.json({ comments });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load comments' });
    }
});
app.post('/api/community/posts/:id/comments', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const author = req.body?.author?.trim();
    const content = req.body?.content?.trim();
    if (Number.isNaN(id) || !content || content.length < 1) {
        return res.status(400).json({ error: 'Invalid post id or content required' });
    }
    try {
        const { id: commentId } = (0, db_1.addComment)(id, author, content);
        res.json({ ok: true, id: commentId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});
app.post('/api/community/posts/:id/reaction', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const type = req.body?.type === 'love' ? 'love' : 'like';
    const fingerprint = req.body?.fingerprint || req.ip || String(Math.random());
    if (Number.isNaN(id))
        return res.status(400).json({ error: 'Invalid post id' });
    try {
        const { added } = (0, db_1.toggleReaction)(id, type, fingerprint);
        const { likeCount, loveCount } = (0, db_1.getPostCounts)(id);
        res.json({
            ok: true,
            added,
            likeCount,
            loveCount,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add reaction' });
    }
});
app.get('/api/community/posts/:id/reaction', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const fingerprint = req.query.fingerprint || '';
    if (Number.isNaN(id))
        return res.status(400).json({ error: 'Invalid post id' });
    try {
        const reaction = (0, db_1.getReaction)(id, fingerprint);
        res.json({ reaction: reaction?.type || null });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get reaction' });
    }
});
// Raffle
app.post('/api/raffle', (req, res) => {
    const email = req.body?.email?.trim();
    const sharedOn = req.body?.sharedOn?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    try {
        (0, db_1.addRaffleEntry)(email, sharedOn);
        res.json({ ok: true, message: "You're in! Good luck." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to enter raffle' });
    }
});
// Serve built frontend in production
const FRONTEND_DIST = path_1.default.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs_1.default.existsSync(FRONTEND_DIST)) {
    app.use(express_1.default.static(FRONTEND_DIST, { maxAge: '1d', etag: true }));
    app.get('/{*path}', (_req, res) => {
        res.sendFile(path_1.default.join(FRONTEND_DIST, 'index.html'));
    });
}
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`[Blue Wave] Backend on port ${PORT} (cwd: ${process.cwd()})`);
    if (MANUS_API_URL) {
        console.log(`[Blue Wave] Subscribe form → proxied to Manus (they send thank you + confirmation)`);
    }
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    if (hasSmtp) {
        console.log('[Blue Wave] Mail: SMTP (Gmail) – sends to any address');
        if (process.env.SMTP_HOST === 'smtp.gmail.com') {
            (0, mail_1.testSmtpConnection)().then((r) => {
                if (r.ok)
                    console.log('[Blue Wave] Gmail SMTP verified OK');
                else
                    console.error('[Blue Wave] Gmail SMTP verify failed:', r.error, '- use App Password from myaccount.google.com/apppasswords');
            });
        }
    }
    else if (hasResend) {
        const fromAddr = process.env.RESEND_FROM || 'onboarding@resend.dev';
        console.log('[Blue Wave] Mail: Resend from', fromAddr);
        console.log('[Blue Wave] Verify domain at resend.com/domains to send to any address');
    }
    else {
        console.warn('[Blue Wave] Mail not configured. Add SMTP_USER/SMTP_PASS or RESEND_API_KEY to backend/.env');
    }
});
