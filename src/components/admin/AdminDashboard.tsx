"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, FileStack, Inbox, LogOut, RefreshCw, Sparkles } from "lucide-react";
import KnowledgeBase from "./KnowledgeBase";
import { CATEGORIES, langName, STATUSES, type Grievance, type Status } from "@/lib/shared";

const STATUS_CLS: Record<Status, string> = {
  Submitted: "bg-sand text-ink",
  "Under Review": "bg-turmeric-soft text-[#8a520c]",
  "Info Requested": "bg-brick-soft text-brick",
  Forwarded: "bg-[#e4ecf7] text-[#274a7a]",
  Resolved: "bg-leaf-soft text-leaf-dark",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"cases" | "kb">("cases");
  const [cases, setCases] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState("");
  const [filter, setFilter] = useState<Status | "All">("All");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/grievances").catch(() => null);
    if (res?.status === 401) return router.refresh();
    const all: Grievance[] = res?.ok ? await res.json() : [];
    setCases(all);
    setSel((s) => s || all[0]?.id || "");
    setLoading(false);
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch from the API
  useEffect(() => void load(), [load]);

  const current = cases.find((c) => c.id === sel);
  const q = query.trim().toLowerCase();
  const shown = cases.filter((c) => (filter === "All" || c.status === filter) && (!q || `${c.id} ${c.cooperative} ${c.district} ${c.description}`.toLowerCase().includes(q)));
  const count = (s: Status[]) => cases.filter((c) => s.includes(c.status)).length;
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    cases.forEach((c) => m.set(c.category, (m.get(c.category) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [cases]);
  const max = Math.max(1, ...byCategory.map(([, n]) => n));

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">SahyogAI Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Authority dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div role="tablist" className="inline-flex rounded-full bg-white p-1 ring-1 ring-line">
            {([["cases", "Grievances"], ["kb", "Knowledge base"]] as const).map(([t, label]) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-ink text-white" : "text-muted"}`}>{label}</button>
            ))}
          </div>
          <button onClick={logout} aria-label="Sign out" className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white"><LogOut size={16} /></button>
        </div>
      </div>

      {tab === "kb" ? (
        <KnowledgeBase />
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {([
              [FileStack, "Total cases", cases.length],
              [Inbox, "Pending", count(["Submitted", "Info Requested"])],
              [Clock, "In progress", count(["Under Review", "Forwarded"])],
              [CheckCircle2, "Resolved", count(["Resolved"])],
            ] as const).map(([I, label, n]) => (
              <div key={label} className="rounded-3xl border border-line bg-white p-5">
                <I size={18} className="text-leaf" />
                <p className="mt-3 text-3xl font-bold">{n}</p>
                <p className="text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>

          {byCategory.length > 0 && (
            <div className="mt-6 rounded-3xl border border-line bg-white p-5">
              <p className="font-semibold">Top grievance categories</p>
              <ul className="mt-4 space-y-2.5">
                {byCategory.map(([cat, n]) => (
                  <li key={cat} className="grid grid-cols-[150px_1fr_28px] items-center gap-3 text-sm">
                    <span className="truncate">{cat}</span>
                    <span className="h-2.5 rounded-full bg-sand"><span className="block h-2.5 rounded-full bg-leaf" style={{ width: `${(n / max) * 100}%` }} /></span>
                    <span className="text-right font-semibold">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-line bg-white p-5">
              <div className="flex gap-2">
                <label htmlFor="search" className="sr-only">Search cases</label>
                <input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, society, district…" className="h-10 min-w-0 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-leaf" />
                <button onClick={load} aria-label="Refresh" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /></button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(["All", ...STATUSES] as const).map((s) => (
                  <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === s ? "bg-ink text-white" : "bg-sand text-muted"}`}>{s}</button>
                ))}
              </div>
              <ul className="mt-4 max-h-[640px] divide-y divide-line overflow-y-auto">
                {shown.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => setSel(c.id)} className={`w-full rounded-2xl px-3 py-3 text-left transition ${sel === c.id ? "bg-leaf-soft" : "hover:bg-cream"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold">{c.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_CLS[c.status]}`}>{c.status}</span>
                      </div>
                      <p className="mt-1 truncate text-sm">{c.priority === "high" && "🔴 "}{c.category} · {c.subcategory}</p>
                      <p className="text-xs text-muted">{c.cooperative}, {c.district} · {langName(c.language)} · {new Date(c.created_at).toLocaleDateString("en-IN")}</p>
                    </button>
                  </li>
                ))}
                {!loading && shown.length === 0 && <li className="py-8 text-center text-sm text-muted">No grievances yet. Cases filed at /grievance appear here.</li>}
              </ul>
            </div>

            {current && <CaseView key={current.id} c={current} all={cases} onSaved={(g) => setCases((cs) => cs.map((x) => (x.id === g.id ? g : x)))} />}
          </div>
        </>
      )}
    </div>
  );
}

function CaseView({ c, all, onSaved }: { c: Grievance; all: Grievance[]; onSaved: (g: Grievance) => void }) {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState(c.category);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const duplicates = all.filter((x) => x.id !== c.id && x.cooperative.toLowerCase() === c.cooperative.toLowerCase() && x.category === c.category);

  async function patch(body: { status?: Status; note?: string; category?: string }) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/grievances/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setError("Update failed. Please sign in again or retry.");
    onSaved(await res.json());
    setNote("");
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xl font-bold">{c.id}</p>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLS[c.status]}`}>{c.status}</span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {[["Issue", c.subcategory], ["Cooperative", c.cooperative], ["Type", c.coop_type || "—"], ["Location", `${c.district}, ${c.state}`], ["Language", langName(c.language)], ["Amount", c.amount || "—"], ["Member", c.member_name || "—"], ["Occurred", c.when_text], ["Priority", c.priority]].map(([k, v]) => (
          <div key={k}><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-end gap-2 text-sm">
        <label className="flex-1">Category (AI suggestion — correct if needed)
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-line px-3 py-2">
            {[...new Set([c.category, ...CATEGORIES])].map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        {category !== c.category && <button disabled={busy} onClick={() => patch({ category })} className="rounded-full bg-ink px-4 py-2 font-semibold text-white">Save</button>}
      </div>

      <div className="mt-5 rounded-2xl bg-leaf-soft p-4 text-sm">
        <p className="flex items-center gap-1.5 font-semibold text-leaf-dark"><Sparkles size={14} /> AI summary</p>
        <p className="mt-1">{c.summary}</p>
      </div>

      <div className="mt-4 text-sm">
        <p className="font-semibold">Member&apos;s statement</p>
        <p className="mt-1 whitespace-pre-line rounded-2xl bg-cream p-3 ring-1 ring-line">{c.description}</p>
      </div>

      {c.required_documents.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="font-semibold">Evidence checklist</p>
          <ul className="mt-1 list-inside list-disc text-muted">{c.required_documents.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold">Formal letter</summary>
        <pre className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-cream p-3 font-sans ring-1 ring-line">{c.letter}</pre>
      </details>

      {duplicates.length > 0 && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-turmeric-soft p-3 text-sm text-[#8a520c]">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" /> Possible duplicate / related: {duplicates.map((d) => d.id).join(", ")}
        </p>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <label htmlFor="note" className="text-sm font-semibold">Response to member (shown on their tracking page)</label>
        <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} placeholder="e.g. Please share a copy of the deposit receipt."
          className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-leaf" />
        <p className="mt-4 text-sm font-semibold">Update status</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATUSES.filter((s) => s !== c.status).map((s) => (
            <button key={s} disabled={busy} onClick={() => patch({ status: s, note: note.trim() || undefined })} className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium transition hover:border-leaf hover:text-leaf disabled:opacity-40">{s}</button>
          ))}
          {note.trim() && <button disabled={busy} onClick={() => patch({ note: note.trim() })} className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-white">Send note only</button>}
        </div>
        {error && <p className="mt-2 text-sm text-brick">{error}</p>}
        <ol className="mt-5 space-y-1.5 text-xs text-muted">
          {c.events.map((h, i) => (
            <li key={i}>{new Date(h.at).toLocaleString("en-IN")} — <span className="font-semibold text-ink">{h.status}</span> ({h.actor}){h.note ? `: ${h.note}` : ""}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
