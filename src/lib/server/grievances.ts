import "server-only";
import { randomInt } from "node:crypto";
import { getDb } from "./db";
import type { Grievance, GrievanceEvent, GrievancePublic, Lang, Status } from "@/lib/shared";

// Unambiguous characters (no 0/O, 1/I/L) so IDs survive being read aloud or handwritten.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** GRV-<year>-<6 random chars>: ~887M combinations per year, so IDs can't be enumerated to read other members' cases. */
function newId() {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `GRV-${new Date().getFullYear()}-${s}`;
}

type Row = Omit<Grievance, "events" | "required_documents" | "language" | "status"> & { required_documents: string; language: Lang; status: Status };

const events = (id: string) =>
  getDb().prepare("SELECT status, note, actor, at FROM grievance_events WHERE grievance_id = ? ORDER BY id").all(id) as unknown as GrievanceEvent[];

const hydrate = (r: Row): Grievance => ({ ...r, required_documents: JSON.parse(r.required_documents), events: events(r.id) });

export type NewGrievance = {
  category: string;
  subcategory: string;
  description: string;
  summary: string;
  cooperative: string;
  coop_type: string;
  district: string;
  state: string;
  when_text: string;
  amount: string;
  member_name: string;
  language: Lang;
  priority: string;
  required_documents: string[];
  letter: string;
};

export function createGrievance(g: NewGrievance) {
  const now = new Date().toISOString();
  let id = newId();
  while (getDb().prepare("SELECT 1 FROM grievances WHERE id = ?").get(id)) id = newId();
  getDb().exec("BEGIN");
  try {
    getDb().prepare(
      `INSERT INTO grievances (id, category, subcategory, description, summary, cooperative, coop_type, district, state, when_text, amount, member_name, language, priority, required_documents, letter, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?)`,
    ).run(id, g.category, g.subcategory, g.description, g.summary, g.cooperative, g.coop_type, g.district, g.state, g.when_text, g.amount, g.member_name, g.language, g.priority, JSON.stringify(g.required_documents), g.letter, now, now);
    getDb().prepare("INSERT INTO grievance_events (grievance_id, status, note, actor, at) VALUES (?, 'Submitted', '', 'member', ?)").run(id, now);
    getDb().exec("COMMIT");
  } catch (e) {
    getDb().exec("ROLLBACK");
    throw e;
  }
  return id;
}

export function getGrievance(id: string): Grievance | null {
  const r = getDb().prepare("SELECT * FROM grievances WHERE id = ?").get(id) as Row | undefined;
  return r ? hydrate(r) : null;
}

export function toPublic(g: Grievance): GrievancePublic {
  const { id, category, subcategory, cooperative, district, status, created_at, events } = g;
  return { id, category, subcategory, cooperative, district, status, created_at, events };
}

export function listGrievances(): Grievance[] {
  return (getDb().prepare("SELECT * FROM grievances ORDER BY created_at DESC").all() as unknown as Row[]).map(hydrate);
}

export function updateGrievance(id: string, patch: { status?: Status; note?: string; category?: string; subcategory?: string }) {
  const g = getGrievance(id);
  if (!g) return null;
  const now = new Date().toISOString();
  const status = patch.status ?? g.status;
  getDb().exec("BEGIN");
  try {
    getDb().prepare("UPDATE grievances SET status = ?, category = ?, subcategory = ?, updated_at = ? WHERE id = ?").run(
      status, patch.category ?? g.category, patch.subcategory ?? g.subcategory, now, id,
    );
    // Audit trail: every status change or note from an authority is recorded.
    if (patch.status || patch.note) {
      getDb().prepare("INSERT INTO grievance_events (grievance_id, status, note, actor, at) VALUES (?, ?, ?, 'authority', ?)").run(id, status, patch.note ?? "", now);
    }
    getDb().exec("COMMIT");
  } catch (e) {
    getDb().exec("ROLLBACK");
    throw e;
  }
  return getGrievance(id);
}
