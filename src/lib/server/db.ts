import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

// ponytail: single-file SQLite (built into Node) — fine for one server + kiosks. Move to PostgreSQL when running multiple app instances.
const file = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "sahyog.db");

function open() {
  mkdirSync(path.dirname(file), { recursive: true });
  // timeout: wait for a concurrent writer instead of failing with "database is locked".
  const db = new DatabaseSync(file, { timeout: 5000 });
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS grievances (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      subcategory TEXT NOT NULL,
      description TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      cooperative TEXT NOT NULL,
      coop_type TEXT NOT NULL DEFAULT '',
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      when_text TEXT NOT NULL,
      amount TEXT NOT NULL DEFAULT '',
      member_name TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'normal',
      required_documents TEXT NOT NULL DEFAULT '[]',
      letter TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grievance_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grievance_id TEXT NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      actor TEXT NOT NULL,
      at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS kb_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authority TEXT NOT NULL,
      source_url TEXT NOT NULL DEFAULT '',
      jurisdiction TEXT NOT NULL,          -- central | state | multi-state
      state TEXT NOT NULL DEFAULT '',
      coop_type TEXT NOT NULL DEFAULT '',  -- empty = applies to all types
      doc_type TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'en',
      effective_date TEXT NOT NULL DEFAULT '',
      last_verified TEXT NOT NULL,
      chunks INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS kb_chunks USING fts5(
      content, section, doc_id UNINDEXED, page UNINDEXED, tokenize = 'unicode61'
    );
  `);
  return db;
}

// Opened lazily on first query (not at import, so `next build` workers never touch the file),
// and reused across dev hot reloads.
const g = globalThis as unknown as { __sahyogDb?: DatabaseSync };
export const getDb = () => (g.__sahyogDb ??= open());
