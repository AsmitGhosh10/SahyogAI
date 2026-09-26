"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, Loader2, Mic, Printer, Search, Sparkles } from "lucide-react";
import { CATEGORIES, COOP_TYPES, LANGS, speechLang, STATES, STATUSES, type GrievanceAnalysis, type GrievancePublic, type Lang } from "@/lib/shared";
import { getRecognition } from "@/lib/speech";

type Details = {
  category: string; subcategory: string; cooperative: string; coop_type: string; district: string; state: string;
  when_text: string; amount: string; member_name: string;
};

const EMPTY: Details = { category: "", subcategory: "", cooperative: "", coop_type: "", district: "", state: "", when_text: "", amount: "", member_name: "" };
const MY_CASES = "sahyog.myCases";

function myCases(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MY_CASES) || "[]");
  } catch {
    return [];
  }
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
  return json as T;
}

export default function GrievancePage() {
  const [tab, setTab] = useState<"new" | "track">("new");
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<Lang>("hi");
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState<GrievanceAnalysis | null>(null);
  const [d, setD] = useState<Details>(EMPTY);
  const [letter, setLetter] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState("");
  const [listening, setListening] = useState(false);

  // Browser-only inputs (query/hash) read after hydration so the static prerender stays valid.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("d");
    if (q) setDescription(q);
    if (window.location.hash === "#track") setTab("track");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setD({ ...d, [k]: e.target.value });
  const detailsDone = d.category && d.subcategory && d.cooperative.length > 1 && d.district.length > 1 && d.state && d.when_text;
  const facts = () => ({ ...d, description, language: lang, required_documents: analysis?.required_documents ?? [] });

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const analyse = () =>
    run(async () => {
      const a = await post<GrievanceAnalysis>("/api/grievances/analyze", { description, language: lang });
      setAnalysis(a);
      setD((x) => ({
        ...x,
        category: a.category, subcategory: a.subcategory,
        cooperative: x.cooperative || a.cooperative, district: x.district || a.district,
        state: x.state || (STATES.includes(a.state) ? a.state : ""), when_text: x.when_text || a.when, amount: x.amount || a.amount,
      }));
      setStep(1);
    });

  const draft = (l = lang) =>
    run(async () => {
      const r = await post<{ letter: string }>("/api/grievances/draft", { ...facts(), language: l });
      setLetter(r.letter);
      setReviewed(false);
      setStep(2);
    });

  const submit = () =>
    run(async () => {
      const r = await post<{ id: string }>("/api/grievances", {
        ...facts(), letter, summary: analysis?.summary ?? "", priority: analysis?.priority ?? "normal",
      });
      setCreatedId(r.id);
      try {
        localStorage.setItem(MY_CASES, JSON.stringify([r.id, ...myCases()].slice(0, 10)));
      } catch {
        /* storage unavailable: the ID is still shown on screen */
      }
      setStep(3);
    });

  function dictate() {
    const r = getRecognition(speechLang(lang));
    if (!r) return setError("Voice input isn't supported in this browser — please type.");
    r.onresult = (e) => setDescription((t) => `${t} ${e.results[0][0].transcript}`.trim());
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    setListening(true);
    r.start();
  }

  const field = "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-leaf";
  const primary = "inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 font-semibold text-white disabled:opacity-40";
  const secondary = "inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-semibold";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 print:p-0">
      <div className="print:hidden">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">📝 शिकायत · অভিযোগ · Grievance</h1>
        <p className="mt-2 text-muted">Describe the problem in your own words. We&apos;ll structure it, draft a formal letter and give you a tracking ID.</p>

        <div role="tablist" className="mt-6 inline-flex rounded-full bg-white p-1 ring-1 ring-line">
          {(["new", "track"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-ink text-white" : "text-muted"}`}>
              {t === "new" ? "File new" : "Track status"}
            </button>
          ))}
        </div>
      </div>

      {tab === "track" ? (
        <Tracker />
      ) : (
        <div className="mt-8">
          <ol className="mb-8 grid grid-cols-4 gap-2 text-xs print:hidden">
            {["Describe", "Details", "Review", "Done"].map((s, i) => (
              <li key={s}>
                <span className={`block h-1.5 rounded-full ${i <= step ? "bg-leaf" : "bg-line"}`} />
                <span className={`mt-2 block ${i === step ? "font-semibold" : "text-muted"}`}>{s}</span>
              </li>
            ))}
          </ol>

          {error && <p role="alert" className="mb-4 rounded-2xl bg-brick-soft px-4 py-3 text-sm text-brick print:hidden">{error}</p>}

          {step === 0 && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="desc" className="font-semibold">What happened?</label>
                <div className="flex rounded-full bg-sand p-1 text-sm">
                  {LANGS.map((l) => (
                    <button key={l.id} onClick={() => setLang(l.id)} className={`rounded-full px-3 py-1 ${lang === l.id ? "bg-white font-semibold shadow-sm" : "text-muted"}`}>{l.label}</button>
                  ))}
                </div>
              </div>
              <textarea id="desc" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={field} maxLength={4000}
                placeholder="e.g. Meri cooperative ne mera ₹20,000 ka deposit return nahi kiya." />
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={dictate} disabled={listening} className={secondary}><Mic size={16} /> {listening ? "Listening…" : "Speak instead"}</button>
                <button disabled={description.trim().length < 8 || busy} onClick={analyse} className={primary}>
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Analyse <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 1 && analysis && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="rounded-2xl bg-leaf-soft p-4 text-sm">
                <p className="flex items-center gap-1.5 font-semibold text-leaf-dark"><Sparkles size={15} /> AI classification (advisory — you can change it)</p>
                <p className="mt-1 text-ink/80">{analysis.summary}</p>
                {analysis.missing_questions.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-ink">{analysis.missing_questions.map((q) => <li key={q}>{q}</li>)}</ul>
                )}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">Category
                  <select className={field} value={d.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                </label>
                <label className="text-sm">Issue<input className={field} value={d.subcategory} onChange={set("subcategory")} maxLength={120} /></label>
                <label className="text-sm">Name of your cooperative *<input className={field} value={d.cooperative} onChange={set("cooperative")} placeholder="ABC PACS" maxLength={160} /></label>
                <label className="text-sm">Cooperative type
                  <select className={field} value={d.coop_type} onChange={set("coop_type")}><option value="">Select…</option>{COOP_TYPES.map((c) => <option key={c}>{c}</option>)}</select>
                </label>
                <label className="text-sm">District *<input className={field} value={d.district} onChange={set("district")} placeholder="Jamtara" maxLength={80} /></label>
                <label className="text-sm">State *
                  <select className={field} value={d.state} onChange={set("state")}><option value="">Select…</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                </label>
                <label className="text-sm">When did it happen? *<input className={field} value={d.when_text} onChange={set("when_text")} placeholder="About six months ago" maxLength={120} /></label>
                <label className="text-sm">Amount involved<input className={field} value={d.amount} onChange={set("amount")} placeholder="₹20,000" maxLength={40} /></label>
                <label className="text-sm sm:col-span-2">Your name (for the letter, optional)<input className={field} value={d.member_name} onChange={set("member_name")} maxLength={120} /></label>
              </div>
              {analysis.required_documents.length > 0 && (
                <div className="mt-5 rounded-2xl bg-turmeric-soft p-4 text-sm">
                  <p className="font-semibold">Keep these documents ready</p>
                  <ul className="mt-1 list-inside list-disc text-muted">{analysis.required_documents.map((e) => <li key={e}>{e}</li>)}</ul>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(0)} className={secondary}><ArrowLeft size={16} /> Back</button>
                <button disabled={!detailsDone || busy} onClick={() => draft()} className={primary}>
                  {busy && <Loader2 size={16} className="animate-spin" />} Draft letter <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                <p className="font-semibold">Your formal grievance — edit anything</p>
                <div className="flex rounded-full bg-sand p-1 text-sm">
                  {LANGS.map((l) => (
                    <button key={l.id} disabled={busy} onClick={() => { setLang(l.id); draft(l.id); }} className={`rounded-full px-3 py-1 ${lang === l.id ? "bg-white font-semibold shadow-sm" : "text-muted"}`}>{l.label}</button>
                  ))}
                </div>
              </div>
              <label htmlFor="letter" className="sr-only">Letter</label>
              <textarea id="letter" value={letter} onChange={(e) => setLetter(e.target.value)} rows={18} maxLength={8000}
                className="mt-4 w-full rounded-2xl bg-cream p-5 text-sm leading-relaxed ring-1 ring-line outline-none focus:ring-leaf print:hidden" />
              <pre className="hidden whitespace-pre-wrap font-sans text-sm print:block">{letter}</pre>
              <label className="mt-5 flex items-start gap-3 text-sm print:hidden">
                <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} className="mt-0.5 h-5 w-5 accent-leaf" />
                I have reviewed this letter and the details are correct.
              </label>
              <div className="mt-6 flex flex-wrap gap-3 print:hidden">
                <button onClick={() => setStep(1)} className={secondary}><ArrowLeft size={16} /> Edit details</button>
                <button onClick={() => window.print()} className={secondary}><Printer size={16} /> Print</button>
                <button disabled={!reviewed || busy || letter.trim().length < 20} onClick={submit} className={primary}>
                  {busy && <Loader2 size={16} className="animate-spin" />} Submit & get tracking ID
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-3xl border border-line bg-white p-6 text-center print:hidden">
              <CheckCircle2 size={48} className="mx-auto text-leaf" />
              <p className="mt-4 text-sm text-muted">Your tracking ID — write it down</p>
              <p className="font-mono text-3xl font-bold tracking-wider">{createdId}</p>
              <button onClick={() => navigator.clipboard?.writeText(createdId)} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-leaf"><Copy size={14} /> Copy</button>
              <p className="mt-3 inline-block rounded-full bg-leaf-soft px-3 py-1 text-sm font-semibold text-leaf-dark">Status: Submitted</p>
              <p className="mx-auto mt-5 max-w-md text-xs text-muted">
                Your case is recorded in SahyogAI and visible to the reviewing authority on the SahyogAI dashboard. It is not
                automatically filed with any government portal — keep a printed copy of the letter to submit to your society.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => { setStep(2); setTimeout(() => window.print(), 50); }} className={secondary}><Printer size={16} /> Print letter</button>
                <button onClick={() => setTab("track")} className="rounded-full bg-ink px-5 py-3 font-semibold text-white">Track status</button>
                <button onClick={() => { setStep(0); setDescription(""); setAnalysis(null); setD(EMPTY); setLetter(""); }} className={secondary}>File another</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Tracker() {
  const [id, setId] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [found, setFound] = useState<GrievancePublic | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is browser-only
  useEffect(() => setRecent(myCases()), []);

  async function lookup(value: string) {
    const clean = value.trim().toUpperCase();
    if (!clean) return;
    setId(clean);
    setBusy(true);
    setError("");
    setFound(null);
    const res = await fetch(`/api/grievances/${encodeURIComponent(clean)}`).catch(() => null);
    setBusy(false);
    if (res?.ok) setFound(await res.json());
    else setError(res?.status === 404 ? "No grievance found with that ID." : "Could not reach the server.");
  }

  return (
    <div className="mt-8 rounded-3xl border border-line bg-white p-6">
      <form onSubmit={(e) => { e.preventDefault(); lookup(id); }} className="flex gap-2">
        <label htmlFor="gid" className="sr-only">Tracking ID</label>
        <input id="gid" value={id} onChange={(e) => setId(e.target.value)} placeholder="GRV-2026-XXXXXX" className="h-12 min-w-0 flex-1 rounded-full border border-line px-5 font-mono uppercase outline-none focus:border-leaf" />
        <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 font-semibold text-white">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Track
        </button>
      </form>
      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted">Filed on this device:</span>
          {recent.map((r) => <button key={r} onClick={() => lookup(r)} className="rounded-full bg-sand px-2.5 py-1 font-mono">{r}</button>)}
        </div>
      )}
      {error && <p className="mt-4 text-sm text-brick">{error}</p>}
      {found && (
        <div className="mt-6">
          <p className="font-mono font-bold">{found.id}</p>
          <p className="text-sm text-muted">{found.category} · {found.subcategory} · {found.cooperative}, {found.district}</p>
          <ol className="mt-5 space-y-3">
            {STATUSES.map((s) => {
              const reached = STATUSES.indexOf(s) <= STATUSES.indexOf(found.status) || found.events.some((e) => e.status === s);
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className={`h-3 w-3 shrink-0 rounded-full ${reached ? "bg-leaf" : "bg-line"}`} />
                  <span className={reached ? "font-semibold" : "text-muted"}>{s}</span>
                </li>
              );
            })}
          </ol>
          <h2 className="mt-6 text-sm font-semibold">Updates</h2>
          <ol className="mt-2 space-y-2 text-sm">
            {found.events.map((e, i) => (
              <li key={i} className="rounded-xl bg-cream px-3 py-2 ring-1 ring-line">
                <span className="text-xs text-muted">{new Date(e.at).toLocaleString("en-IN")}</span> — <span className="font-semibold">{e.status}</span>
                {e.note && <p className="mt-1">{e.note}</p>}
              </li>
            ))}
          </ol>
          <Link href="/assistant" className="mt-5 inline-block text-sm font-semibold text-leaf hover:underline">Ask the assistant about your rights →</Link>
        </div>
      )}
    </div>
  );
}
