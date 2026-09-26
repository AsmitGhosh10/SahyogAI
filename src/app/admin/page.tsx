"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, FileStack, Inbox, Sparkles } from "lucide-react";
import { classify, loadGrievances, saveGrievance, STATUSES, type Grievance, type Status } from "@/lib/demo";

const LANG_NAME = { en: "English", hi: "Hindi", bn: "Bengali" };
const STATUS_CLS: Record<Status, string> = {
  Submitted: "bg-sand text-ink",
  "Under Review": "bg-turmeric-soft text-[#8a520c]",
  "Info Requested": "bg-brick-soft text-brick",
  Forwarded: "bg-[#e4ecf7] text-[#274a7a]",
  Resolved: "bg-leaf-soft text-leaf-dark",
};

export default function Admin() {
  const [cases, setCases] = useState<Grievance[]>([]);
  const [sel, setSel] = useState<string>("");
  const [filter, setFilter] = useState<Status | "All">("All");
  const [note, setNote] = useState("");

  useEffect(() => {
    // localStorage is browser-only; load after hydration so the static prerender stays valid.
    const all = loadGrievances();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCases(all);
    setSel(all[0]?.id ?? "");
  }, []);

  const current = cases.find((c) => c.id === sel);
  const shown = filter === "All" ? cases : cases.filter((c) => c.status === filter);
  const count = (s: Status[]) => cases.filter((c) => s.includes(c.status)).length;
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    cases.forEach((c) => m.set(c.category, (m.get(c.category) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [cases]);
  const max = Math.max(1, ...byCategory.map(([, n]) => n));

  function update(status: Status) {
    if (!current) return;
    const g = { ...current, status, history: [...current.history, { status, at: new Date().toISOString(), note: note.trim() || undefined }] };
    saveGrievance(g);
    setCases((cs) => cs.map((c) => (c.id === g.id ? g : c)));
    setNote("");
  }

  const duplicates = current ? cases.filter((c) => c.id !== current.id && c.cooperative === current.cooperative && c.category === current.category) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">SahyogAI Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Grievance dashboard</h1>
        </div>
        <p className="rounded-full bg-turmeric-soft px-3 py-1 text-xs font-semibold text-[#8a520c]">Demo data · AI output is advisory</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          [FileStack, "Total cases", cases.length],
          [Inbox, "Pending", count(["Submitted", "Info Requested"])],
          [Clock, "Under review", count(["Under Review", "Forwarded"])],
          [CheckCircle2, "Resolved", count(["Resolved"])],
        ].map(([Icon, label, n]) => {
          const I = Icon as typeof Inbox;
          return (
            <div key={label as string} className="rounded-3xl border border-line bg-white p-5">
              <I size={18} className="text-leaf" />
              <p className="mt-3 text-3xl font-bold">{n as number}</p>
              <p className="text-sm text-muted">{label as string}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-5">
        <p className="font-semibold">Top grievance categories</p>
        <ul className="mt-4 space-y-2.5">
          {byCategory.map(([cat, n]) => (
            <li key={cat} className="grid grid-cols-[140px_1fr_24px] items-center gap-3 text-sm">
              <span className="truncate">{cat}</span>
              <span className="h-2.5 rounded-full bg-sand"><span className="block h-2.5 rounded-full bg-leaf" style={{ width: `${(n / max) * 100}%` }} /></span>
              <span className="text-right font-semibold">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Queue */}
        <div className="rounded-3xl border border-line bg-white p-5">
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === s ? "bg-ink text-white" : "bg-sand text-muted"}`}>{s}</button>
            ))}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {shown.map((c) => (
              <li key={c.id}>
                <button onClick={() => setSel(c.id)} className={`w-full rounded-2xl px-3 py-3 text-left transition ${sel === c.id ? "bg-leaf-soft" : "hover:bg-cream"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold">{c.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_CLS[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="mt-1 truncate text-sm">{c.category} · {c.subcategory}</p>
                  <p className="text-xs text-muted">{c.cooperative}, {c.district} · {LANG_NAME[c.language]}</p>
                </button>
              </li>
            ))}
            {shown.length === 0 && <li className="py-6 text-center text-sm text-muted">No cases.</li>}
          </ul>
        </div>

        {/* Case view */}
        {current && (
          <div className="rounded-3xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xl font-bold">{current.id}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLS[current.status]}`}>{current.status}</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {[["Category", current.category], ["Subcategory", current.subcategory], ["Cooperative", current.cooperative], ["Location", `${current.district}, ${current.state}`], ["Language", LANG_NAME[current.language]], ["Amount", current.amount || "—"]].map(([k, v]) => (
                <div key={k}><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>

            <div className="mt-5 rounded-2xl bg-leaf-soft p-4 text-sm">
              <p className="flex items-center gap-1.5 font-semibold text-leaf-dark"><Sparkles size={14} /> AI summary</p>
              <p className="mt-1">
                Member of {current.cooperative} ({current.district}) reports a {current.subcategory.toLowerCase()} issue
                {current.amount ? ` involving ${current.amount}` : ""}, first noticed {current.when}. Raised in {LANG_NAME[current.language]}.
              </p>
            </div>

            <div className="mt-4 text-sm">
              <p className="font-semibold">User statement</p>
              <p className="mt-1 rounded-2xl bg-cream p-3 ring-1 ring-line">{current.description}</p>
            </div>

            <div className="mt-4 text-sm">
              <p className="font-semibold">Evidence checklist</p>
              <ul className="mt-1 list-inside list-disc text-muted">{classify(current.description).evidence.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>

            {duplicates.length > 0 && (
              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-turmeric-soft p-3 text-sm text-[#8a520c]">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> Possible duplicate of {duplicates.map((d) => d.id).join(", ")}
              </p>
            )}

            <div className="mt-6 border-t border-line pt-5">
              <label htmlFor="note" className="text-sm font-semibold">Response / note to member</label>
              <input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please share the deposit receipt." className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-leaf" />
              <p className="mt-4 text-sm font-semibold">Update status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUSES.filter((s) => s !== current.status).map((s) => (
                  <button key={s} onClick={() => update(s)} className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium transition hover:border-leaf hover:text-leaf">{s}</button>
                ))}
              </div>
              <ol className="mt-5 space-y-1.5 text-xs text-muted">
                {current.history.map((h, i) => (
                  <li key={i}>{new Date(h.at).toLocaleString("en-IN")} — <span className="font-semibold text-ink">{h.status}</span>{h.note ? `: ${h.note}` : ""}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
