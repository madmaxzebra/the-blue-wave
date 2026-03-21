import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'subscribers.db');
const db = new Database(dbPath);

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

export function addSubscriber(email: string, referralCode?: string): { ok: boolean } {
  try {
    const code = referralCode || generateCode();
    const stmt = db.prepare(
      'INSERT OR IGNORE INTO Subscriber (email, referralCode) VALUES (?, ?)'
    );
    stmt.run(email.toLowerCase().trim(), code);
    return { ok: true };
  } catch {
    return { ok: true };
  }
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function getSubscriberCount(): number {
  const row = db.prepare('SELECT COUNT(*) as c FROM Subscriber').get() as { c: number };
  return row?.c ?? 0;
}

// Community feed
export function addPost(author: string, content: string, photoData?: string): { id: number } {
  const stmt = db.prepare(
    'INSERT INTO CommunityPost (author, content, photoData) VALUES (?, ?, ?)'
  );
  const r = stmt.run(
    (author || 'Anonymous').trim().slice(0, 50),
    content.trim().slice(0, 2000),
    photoData && photoData.length < 500000 ? photoData : null
  );
  return { id: r.lastInsertRowid as number };
}

export function getPosts(limit = 50): Array<{
  id: number;
  author: string;
  content: string;
  photoData: string | null;
  createdAt: string;
  likeCount: number;
  loveCount: number;
  commentCount: number;
}> {
  const rows = db.prepare(`
    SELECT p.id, p.author, p.content, p.photoData, p.createdAt,
      (SELECT COUNT(*) FROM CommunityReaction r WHERE r.postId = p.id AND r.type = 'like') as likeCount,
      (SELECT COUNT(*) FROM CommunityReaction r WHERE r.postId = p.id AND r.type = 'love') as loveCount,
      (SELECT COUNT(*) FROM CommunityComment c WHERE c.postId = p.id) as commentCount
    FROM CommunityPost p
    ORDER BY p.createdAt DESC
    LIMIT ?
  `).all(limit) as any[];
  return rows.map((r) => ({ ...r, commentCount: r.commentCount ?? 0 }));
}

export function addComment(postId: number, author: string, content: string): { id: number } {
  const stmt = db.prepare(
    'INSERT INTO CommunityComment (postId, author, content) VALUES (?, ?, ?)'
  );
  const r = stmt.run(postId, (author || 'Anonymous').trim().slice(0, 50), content.trim().slice(0, 500));
  return { id: r.lastInsertRowid as number };
}

export function getComments(postId: number): Array<{ id: number; author: string; content: string; createdAt: string }> {
  return db.prepare(
    'SELECT id, author, content, createdAt FROM CommunityComment WHERE postId = ? ORDER BY createdAt ASC'
  ).all(postId) as any[];
}

export function toggleReaction(postId: number, type: 'like' | 'love', fingerprint: string): { added: boolean } {
  const existing = db.prepare(
    'SELECT type FROM CommunityReaction WHERE postId = ? AND fingerprint = ?'
  ).get(postId, fingerprint) as { type: string } | undefined;
  if (existing) {
    if (existing.type === type) {
      db.prepare('DELETE FROM CommunityReaction WHERE postId = ? AND fingerprint = ?').run(postId, fingerprint);
      return { added: false };
    }
    db.prepare('UPDATE CommunityReaction SET type = ? WHERE postId = ? AND fingerprint = ?').run(type, postId, fingerprint);
  } else {
    db.prepare('INSERT INTO CommunityReaction (postId, type, fingerprint) VALUES (?, ?, ?)').run(postId, type, fingerprint);
  }
  return { added: true };
}

export function getReaction(postId: number, fingerprint: string): { type: string } | null {
  return db.prepare(
    'SELECT type FROM CommunityReaction WHERE postId = ? AND fingerprint = ?'
  ).get(postId, fingerprint) as { type: string } | null;
}

export function getPostCounts(postId: number): { likeCount: number; loveCount: number } {
  const r = db.prepare(
    `SELECT
      (SELECT COUNT(*) FROM CommunityReaction WHERE postId = ? AND type = 'like') as likeCount,
      (SELECT COUNT(*) FROM CommunityReaction WHERE postId = ? AND type = 'love') as loveCount
    `).get(postId, postId) as { likeCount: number; loveCount: number };
  return { likeCount: r?.likeCount ?? 0, loveCount: r?.loveCount ?? 0 };
}

// Raffle
export function addRaffleEntry(email: string, sharedOn?: string): { ok: boolean } {
  try {
    db.prepare('INSERT INTO RaffleEntry (email, sharedOn) VALUES (?, ?)').run(
      email.toLowerCase().trim(),
      sharedOn?.trim().slice(0, 100) || null
    );
    return { ok: true };
  } catch {
    return { ok: true };
  }
}
