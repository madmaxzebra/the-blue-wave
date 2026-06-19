"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToSubscribers = broadcastToSubscribers;
const db_1 = require("./db");
const mail_1 = require("./mail");
const broadcastContent_1 = require("./broadcastContent");
const env_1 = require("./env");
const SEND_DELAY_MS = 350;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function broadcastToSubscribers(options) {
    const subject = options.subject.trim();
    const message = options.message.trim();
    const stats = (0, db_1.getRealSubscriberStats)();
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
    const messageHtml = (0, broadcastContent_1.plainTextToHtml)(message);
    const site = (0, env_1.getSiteUrl)();
    let sent = 0;
    const failures = [];
    for (const email of recipients) {
        const result = await (0, mail_1.sendBroadcastEmail)(email, subject, messageHtml, message, site);
        if (result.ok) {
            sent += 1;
        }
        else {
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
