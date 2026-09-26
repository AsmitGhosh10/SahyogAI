import "server-only";
import { getDb } from "./db";
import { chunkPages, ftsQuery } from "./chunk";

export type KbDocMeta = {
  title: string;
  authority: string;
  source_url: string;
  jurisdiction: "central" | "state" | "multi-state";
  state: string;
  coop_type: string;
  doc_type: string;
  language: string;
  effective_date: string;
  last_verified: string;
};

export type KbDoc = KbDocMeta & { id: number; chunks: number; created_at: string };

export type Chunk = {
  chunk_id: number;
  content: string;
  section: string;
  page: number;
  doc: KbDoc;
};

export function addDocument(meta: KbDocMeta, pages: string[]) {
  const chunks = chunkPages(pages);
  if (chunks.length === 0) throw new Error("No readable text found. Scanned PDFs need OCR before upload.");
  getDb().exec("BEGIN");
  try {
    const { lastInsertRowid } = getDb()
      .prepare(
        `INSERT INTO kb_documents (title, authority, source_url, jurisdiction, state, coop_type, doc_type, language, effective_date, last_verified, chunks, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(meta.title, meta.authority, meta.source_url, meta.jurisdiction, meta.state, meta.coop_type, meta.doc_type, meta.language, meta.effective_date, meta.last_verified, chunks.length, new Date().toISOString());
    const ins = getDb().prepare("INSERT INTO kb_chunks (content, section, doc_id, page) VALUES (?, ?, ?, ?)");
    for (const c of chunks) ins.run(c.content, c.section, Number(lastInsertRowid), c.page);
    getDb().exec("COMMIT");
    return { id: Number(lastInsertRowid), chunks: chunks.length };
  } catch (e) {
    getDb().exec("ROLLBACK");
    throw e;
  }
}

export function listDocuments(): KbDoc[] {
  return getDb().prepare("SELECT * FROM kb_documents ORDER BY created_at DESC").all() as unknown as KbDoc[];
}

export function deleteDocument(id: number) {
  getDb().prepare("DELETE FROM kb_chunks WHERE doc_id = ?").run(id);
  getDb().prepare("DELETE FROM kb_documents WHERE id = ?").run(id);
}

/**
 * Jurisdiction-aware retrieval (PRD §7): documents are filtered by applicability before ranking.
 * - Multi-State cooperative → multi-state + central documents only.
 * - Known state → that state's documents + central documents.
 * - Unknown state → everything (caller must treat the result as not jurisdiction-confirmed).
 */
export function search(terms: string[], state: string, coopType: string, limit = 6): Chunk[] {
  const q = ftsQuery(terms);
  if (!q) return [];
  const multi = /multi/i.test(coopType) || /multi/i.test(state);
  const where = multi
    ? "d.jurisdiction IN ('multi-state','central')"
    : state
      ? "(d.jurisdiction = 'central' OR (d.jurisdiction = 'state' AND d.state = :state))"
      : "1 = 1";
  const coop = coopType && !multi ? "AND (d.coop_type = '' OR d.coop_type = :coop)" : "";
  // node:sqlite rejects unused named parameters, so bind only what the SQL references.
  const params: Record<string, string | number> = { q, limit };
  if (!multi && state) params.state = state;
  if (coop) params.coop = coopType;
  const rows = getDb()
    .prepare(
      `SELECT c.rowid AS chunk_id, c.content, c.section, c.page, d.*
       FROM kb_chunks c JOIN kb_documents d ON d.id = c.doc_id
       WHERE kb_chunks MATCH :q AND ${where} ${coop}
       ORDER BY bm25(kb_chunks) LIMIT :limit`,
    )
    .all(params) as unknown as (KbDoc & { chunk_id: number; content: string; section: string; page: number })[];
  return rows.map(({ chunk_id, content, section, page, ...doc }) => ({ chunk_id, content, section, page: Number(page), doc: doc as KbDoc }));
}
