"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, Trash2, Upload } from "lucide-react";
import { COOP_TYPES, STATES } from "@/lib/shared";

type Doc = {
  id: number; title: string; authority: string; source_url: string; jurisdiction: string; state: string; coop_type: string;
  doc_type: string; language: string; last_verified: string; chunks: number;
};

export default function KnowledgeBase() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [jurisdiction, setJurisdiction] = useState("state");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/knowledge").catch(() => null);
    if (res?.ok) setDocs(await res.json());
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch from the API
  useEffect(() => void load(), [load]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/knowledge", { method: "POST", body: new FormData(form) }).catch(() => null);
    const json = await res?.json().catch(() => ({}));
    setBusy(false);
    if (res?.ok) {
      setMsg({ ok: true, text: `Indexed ${json.chunks} passages.` });
      form.reset();
      load();
    } else setMsg({ ok: false, text: json?.error || "Upload failed." });
  }

  async function remove(d: Doc) {
    if (!confirm(`Remove "${d.title}" from the knowledge base? Answers will stop citing it.`)) return;
    await fetch(`/api/knowledge/${d.id}`, { method: "DELETE" });
    load();
  }

  const field = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-line bg-white p-5">
        <p className="font-semibold">Verified documents ({docs.length})</p>
        <p className="mt-1 text-sm text-muted">The assistant cites only these. Upload official Acts, Rules, bye-laws and scheme guidelines — not random web content.</p>
        <ul className="mt-4 divide-y divide-line">
          {docs.map((d) => (
            <li key={d.id} className="flex items-start justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-semibold">{d.title}</p>
                <p className="text-xs text-muted">
                  {d.authority} · {d.jurisdiction}{d.state ? ` (${d.state})` : ""} · {d.coop_type || "all types"} · {d.doc_type} · {d.chunks} passages · verified {d.last_verified}
                </p>
                {d.source_url && <a href={d.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-leaf">Source <ExternalLink size={11} /></a>}
              </div>
              <button onClick={() => remove(d)} aria-label={`Remove ${d.title}`} className="rounded-full p-2 text-muted hover:bg-brick-soft hover:text-brick"><Trash2 size={15} /></button>
            </li>
          ))}
          {docs.length === 0 && <li className="py-8 text-center text-sm text-muted">No documents yet. Until you add some, legal questions return &quot;insufficient evidence&quot;.</li>}
        </ul>
      </div>

      <form onSubmit={upload} className="h-fit rounded-3xl border border-line bg-white p-5 text-sm">
        <p className="flex items-center gap-2 font-semibold"><Upload size={16} /> Add official document</p>
        <label className="mt-4 block">File (PDF with text layer, TXT or MD)
          <input name="file" type="file" accept=".pdf,.txt,.md,application/pdf,text/plain" className={field} />
        </label>
        <label className="mt-3 block">…or paste text
          <textarea name="text" rows={3} className={field} placeholder="Section 12. Voting rights of members…" />
        </label>
        <label className="mt-3 block">Title *<input name="title" required className={field} placeholder="Jharkhand Self-Supporting Cooperative Societies Act, 1996" /></label>
        <label className="mt-3 block">Issuing authority *<input name="authority" required className={field} placeholder="Government of Jharkhand" /></label>
        <label className="mt-3 block">Official source URL<input name="source_url" type="url" className={field} placeholder="https://www.indiacode.nic.in/…" /></label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label>Jurisdiction *
            <select name="jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className={field}>
              <option value="state">State</option><option value="central">Central</option><option value="multi-state">Multi-State</option>
            </select>
          </label>
          <label>State{jurisdiction === "state" && " *"}
            <select name="state" required={jurisdiction === "state"} disabled={jurisdiction !== "state"} className={field}>
              <option value="">—</option>{STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Applies to
            <select name="coop_type" className={field}><option value="">All types</option>{COOP_TYPES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label>Document type *
            <select name="doc_type" className={field}>{["Act", "Rules", "Bye-laws", "Scheme guideline", "Circular", "FAQ"].map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label>Language
            <select name="language" className={field}><option value="en">English</option><option value="hi">Hindi</option><option value="bn">Bengali</option></select>
          </label>
          <label>Effective date<input name="effective_date" type="date" className={field} /></label>
          <label className="col-span-2">Last verified *<input name="last_verified" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={field} /></label>
        </div>
        {msg && <p role="status" className={`mt-3 ${msg.ok ? "text-leaf" : "text-brick"}`}>{msg.text}</p>}
        <button disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf py-3 font-semibold text-white disabled:opacity-40">
          {busy && <Loader2 size={16} className="animate-spin" />} Index document
        </button>
      </form>
    </div>
  );
}
