"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSubscriberEmail = normalizeSubscriberEmail;
exports.isTestSubscriberEmail = isTestSubscriberEmail;
const DEFAULT_TEST_EMAILS = 'madmax.zebra@gmail.com,madmax@zebra-onlinedesign.com';
function parseTestEmails(raw) {
    return new Set((raw || DEFAULT_TEST_EMAILS)
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean));
}
const TEST_SUBSCRIBER_EMAILS = parseTestEmails(process.env.TEST_SUBSCRIBER_EMAILS);
function normalizeSubscriberEmail(email) {
    return email.trim().toLowerCase();
}
function isTestSubscriberEmail(email) {
    return TEST_SUBSCRIBER_EMAILS.has(normalizeSubscriberEmail(email));
}
