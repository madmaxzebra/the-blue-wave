"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscriber = addSubscriber;
exports.getSubscriberCount = getSubscriberCount;
exports.addPost = addPost;
exports.getPosts = getPosts;
exports.addComment = addComment;
exports.getComments = getComments;
exports.toggleReaction = toggleReaction;
exports.getReaction = getReaction;
exports.getPostCounts = getPostCounts;
exports.addRaffleEntry = addRaffleEntry;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const testEmails_1 = require("./testEmails");
const dbPath = path_1.default.join(__dirname, '..', 'subscribers.db');
const db = new better_sqlite3_1.default(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS Subscriber (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    referralCode TEXT UNIQUE,
    referredBy TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS CommunityPost (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL DEFAULT 'Anonymous',
    content TEXT NOT NULL,
    photoData TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS CommunityComment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER NOT NULL,
    author TEXT NOT NULL DEFAULT 'Anonymous',
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (postId) REFERENCES CommunityPost(id) ON DELETE CASCADE
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS CommunityReaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('like','love')),
    fingerprint TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(postId, fingerprint),
    FOREIGN KEY (postId) REFERENCES CommunityPost(id) ON DELETE CASCADE
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS RaffleEntry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    sharedOn TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
function addSubscriber(email, referralCode) {
    try {
        const normalized = (0, testEmails_1.normalizeSubscriberEmail)(email);
        const code = referralCode || generateCode();
        if ((0, testEmails_1.isTestSubscriberEmail)(normalized)) {
            db.prepare('DELETE FROM Subscriber WHERE email = ?').run(normalized);
        }
        const stmt = db.prepare('INSERT OR IGNORE INTO Subscriber (email, referralCode) VALUES (?, ?)');
        const result = stmt.run(normalized, code);
        return { ok: true, added: result.changes > 0 };
    }
    catch {
        return { ok: true, added: false };
    }
}
function generateCode() {
    return Math.random().toString(36).slice(2, 10);
}
function getSubscriberCount() {
    const row = db.prepare('SELECT COUNT(*) as c FROM Subscriber').get();
    return row?.c ?? 0;
}
// Community feed
function addPost(author, content, photoData) {
    const stmt = db.prepare('INSERT INTO CommunityPost (author, content, photoData) VALUES (?, ?, ?)');
    const r = stmt.run((author || 'Anonymous').trim().slice(0, 50), content.trim().slice(0, 2000), photoData && photoData.length < 500000 ? photoData : null);
    return { id: r.lastInsertRowid };
}
function getPosts(limit = 50) {
    const rows = db.prepare(`
    SELECT p.id, p.author, p.content, p.photoData, p.createdAt,
      (SELECT COUNT(*) FROM CommunityReaction r WHERE r.postId = p.id AND r.type = 'like') as likeCount,
      (SELECT COUNT(*) FROM CommunityReaction r WHERE r.postId = p.id AND r.type = 'love') as loveCount,
      (SELECT COUNT(*) FROM CommunityComment c WHERE c.postId = p.id) as commentCount
    FROM CommunityPost p
    ORDER BY p.createdAt DESC
    LIMIT ?
  `).all(limit);
    return rows.map((r) => ({ ...r, commentCount: r.commentCount ?? 0 }));
}
function addComment(postId, author, content) {
    const stmt = db.prepare('INSERT INTO CommunityComment (postId, author, content) VALUES (?, ?, ?)');
    const r = stmt.run(postId, (author || 'Anonymous').trim().slice(0, 50), content.trim().slice(0, 500));
    return { id: r.lastInsertRowid };
}
function getComments(postId) {
    return db.prepare('SELECT id, author, content, createdAt FROM CommunityComment WHERE postId = ? ORDER BY createdAt ASC').all(postId);
}
function toggleReaction(postId, type, fingerprint) {
    const existing = db.prepare('SELECT type FROM CommunityReaction WHERE postId = ? AND fingerprint = ?').get(postId, fingerprint);
    if (existing) {
        if (existing.type === type) {
            db.prepare('DELETE FROM CommunityReaction WHERE postId = ? AND fingerprint = ?').run(postId, fingerprint);
            return { added: false };
        }
        db.prepare('UPDATE CommunityReaction SET type = ? WHERE postId = ? AND fingerprint = ?').run(type, postId, fingerprint);
    }
    else {
        db.prepare('INSERT INTO CommunityReaction (postId, type, fingerprint) VALUES (?, ?, ?)').run(postId, type, fingerprint);
    }
    return { added: true };
}
function getReaction(postId, fingerprint) {
    return db.prepare('SELECT type FROM CommunityReaction WHERE postId = ? AND fingerprint = ?').get(postId, fingerprint);
}
function getPostCounts(postId) {
    const r = db.prepare(`SELECT
      (SELECT COUNT(*) FROM CommunityReaction WHERE postId = ? AND type = 'like') as likeCount,
      (SELECT COUNT(*) FROM CommunityReaction WHERE postId = ? AND type = 'love') as loveCount
    `).get(postId, postId);
    return { likeCount: r?.likeCount ?? 0, loveCount: r?.loveCount ?? 0 };
}
// Raffle
function addRaffleEntry(email, sharedOn) {
    try {
        db.prepare('INSERT INTO RaffleEntry (email, sharedOn) VALUES (?, ?)').run(email.toLowerCase().trim(), sharedOn?.trim().slice(0, 100) || null);
        return { ok: true };
    }
    catch {
        return { ok: true };
    }
}
