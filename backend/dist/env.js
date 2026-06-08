"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmtpHost = getSmtpHost;
exports.getSmtpPort = getSmtpPort;
exports.getSmtpUser = getSmtpUser;
exports.getSmtpPass = getSmtpPass;
exports.getAdminEmail = getAdminEmail;
exports.getSiteUrl = getSiteUrl;
exports.getResendApiKey = getResendApiKey;
exports.hasSmtpConfig = hasSmtpConfig;
exports.hasResendConfig = hasResendConfig;
/** Read env vars, including common Render dashboard typos (SMPT_*, Admin_email, site_url). */
function pick(...keys) {
    for (const key of keys) {
        const v = process.env[key];
        if (v && v.trim())
            return v.trim();
    }
    return '';
}
function getSmtpHost() {
    return pick('SMTP_HOST') || 'smtp.gmail.com';
}
function getSmtpPort() {
    const raw = pick('SMTP_PORT', 'SMPT_PORT');
    return raw ? Number(raw) : 587;
}
function getSmtpUser() {
    return pick('SMTP_USER', 'SMPT_USER');
}
function getSmtpPass() {
    return pick('SMTP_PASS', 'SMPT_PASS').replace(/\s+/g, '');
}
function getAdminEmail() {
    return pick('ADMIN_EMAIL', 'Admin_email', 'ADMIN_email');
}
function getSiteUrl() {
    return pick('SITE_URL', 'site_url', 'Site_URL') || 'https://www.thebluewavefans.com';
}
function getResendApiKey() {
    return pick('RESEND_API_KEY');
}
function hasSmtpConfig() {
    return !!(getSmtpUser() && getSmtpPass());
}
function hasResendConfig() {
    return !!getResendApiKey();
}
