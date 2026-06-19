"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriberAdminKeyConfigured = subscriberAdminKeyConfigured;
exports.subscriberAdminKeyOk = subscriberAdminKeyOk;
exports.readSubscriberAdminKey = readSubscriberAdminKey;
exports.requireSubscriberAdmin = requireSubscriberAdmin;
const crypto_1 = require("crypto");
function subscriberAdminKeyConfigured() {
    return Boolean((process.env.SUBSCRIBER_ADMIN_KEY || '').trim());
}
function subscriberAdminKeyOk(provided) {
    const expected = (process.env.SUBSCRIBER_ADMIN_KEY || '').trim();
    if (!expected || !provided)
        return false;
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(a, b);
}
function readSubscriberAdminKey(req) {
    const fromQuery = req.query.key;
    if (typeof fromQuery === 'string' && fromQuery.trim())
        return fromQuery.trim();
    const fromHeader = req.headers['x-admin-key'];
    if (typeof fromHeader === 'string' && fromHeader.trim())
        return fromHeader.trim();
    return '';
}
function requireSubscriberAdmin(req, res) {
    if (!subscriberAdminKeyConfigured()) {
        res.status(503).json({
            ok: false,
            error: 'Admin not configured. Set SUBSCRIBER_ADMIN_KEY on Render.',
        });
        return false;
    }
    if (!subscriberAdminKeyOk(readSubscriberAdminKey(req))) {
        res.status(403).json({ ok: false, error: 'Forbidden' });
        return false;
    }
    return true;
}
