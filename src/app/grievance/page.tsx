"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Printer, Search, Sparkles } from "lucide-react";
import { classify, LANGS, loadGrievances, newId, saveGrievance, STATES, STATUSES, type Grievance, type Lang } from "@/lib/demo";

type Draft = { description: string; cooperative: string; district: string; state: string; when: string; amount: string };

function letter(g: Draft & { category: string; subcategory: string }, lang: Lang) {
  const date = new Date().toLocaleDateString("en-IN");
  const amt = g.amount ? ` (${g.amount})` : "";
  if (lang === "hi")
    return `विषय: ${g.subcategory}${amt} के संबंध में शिकायत\n\nसेवा में,\nसचिव / प्रबंध समिति, ${g.cooperative}\nज़िला ${g.district}, ${g.state}\n\nमहोदय/महोदया,\n\nमैं ${g.cooperative} का सदस्य/सदस्या हूँ। मैं निम्नलिखित समस्या की सूचना देना चाहता/चाहती हूँ:\n\n${g.description}\n\nघटना का समय: ${g.when}\nश्रेणी: ${g.category} — ${g.subcategory}\n\nअनुरोध: कृपया इस मामले की जाँच कर उचित कार्रवाई करें और मुझे लिखित में सूचित करें।\n\nसंलग्नक: [दस्तावेज़ों की सूची]\n\nदिनांक: ${date}\nहस्ताक्षर: ____________`;
  if (lang === "bn")
    return `বিষয়: ${g.subcategory}${amt} সংক্রান্ত অভিযোগ\n\nপ্রতি,\nসম্পাদক / পরিচালন সমিতি, ${g.cooperative}\nজেলা ${g.district}, ${g.state}\n\nমহাশয়/মহাশয়া,\n\nআমি ${g.cooperative}-এর একজন সদস্য। আমি নিম্নলিখিত সমস্যাটি জানাতে চাই:\n\n${g.description}\n\nঘটনার সময়: ${g.when}\nবিভাগ: ${g.category} — ${g.subcategory}\n\nঅনুরোধ: অনুগ্রহ করে বিষয়টি তদন্ত করে যথাযথ ব্যবস্থা নিন এবং আমাকে লিখিতভাবে জানান।\n\nসংযুক্তি: [নথির তালিকা]\n\nতারিখ: ${date}\nস্বাক্ষর: ____________`;
  return `Subject: Grievance regarding ${g.subcategory.toLowerCase()}${amt}\n\nTo,\nThe Secretary / Managing Committee, ${g.cooperative}\nDistrict ${g.district}, ${g.state}\n\nRespected Sir/Madam,\n\nI am a member of ${g.cooperative}. I am reporting the following issue:\n\n${g.description}\n\nWhen it occurred: ${g.when}\nCategory: ${g.category} — ${g.subcategory}\n\nRequested action: Kindly look into this matter, take appropriate action and inform me in writing.\n\nAttachments: [list of documents]\n\nDate: ${date}\nSignature: ____________`;
}

export default function GrievancePage() {
  const [tab, setTab] = useState<"new" | "track">("new");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ description: "", cooperative: "", district: "", state: "", when: "", amount: "" });
  const [lang, setLang] = useState<Lang>("hi");
  const [reviewed, setReviewed] = useState(false);
  const [created, setCreated] = useState<Grievance | null>(null);

  // Browser-only inputs (query/hash) read after hydration so the static prerender stays valid.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("d");
    if (d) setDraft((x) => ({ ...x, description: d }));
    if (window.location.hash === "#track") setTab("track");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const ai = classify(draft.description);
  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDraft({ ...draft, [k]: e.target.value });
  const detailsDone = draft.cooperative && draft.district && draft.state && draft.when;

  function submit() {
    const now = new Date().toISOString();
    const g: Grievance = {
      id: newId(), category: ai.category, subcategory: ai.subcategory, ...draft, amount: draft.amount || ai.amount, language: lang,
      status: "Submitted", createdAt: now, history: [{ status: "Submitted", at: now }],
    };
    saveGrievance(g);
    setCreated(g);
    setStep(3);
  }

  const field = "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-leaf";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">📝 शिकायत · অভিযোগ · Grievance</h1>
      <p className="mt-2 text-muted">Describe the problem in your own words. We&apos;ll structure it and give you a tracking ID.</p>

      <div role="tablist" className="mt-6 inline-flex rounded-full bg-white p-1 ring-1 ring-line">
        {(["new", "track"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-ink text-white" : "text-muted"}`}>
            {t === "new" ? "File new" : "Track status"}
          </button>
        ))}
      </div>

      {tab === "track" ? (
        <Tracker />
      ) : (
        <div className="mt-8">
          <ol className="mb-8 grid grid-cols-4 gap-2 text-xs">
            {["Describe", "Details", "Review", "Done"].map((s, i) => (
              <li key={s}>
                <span className={`block h-1.5 rounded-full ${i <= step ? "bg-leaf" : "bg-line"}`} />
                <span className={`mt-2 block ${i === step ? "font-semibold" : "text-muted"}`}>{s}</span>
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <label htmlFor="desc" className="font-semibold">What happened?</label>
              <textarea id="desc" rows={5} value={draft.description} onChange={set("description")} className={field}
                placeholder="e.g. Meri cooperative ne mera ₹20,000 ka deposit return nahi kiya." />
              {draft.description.trim().length > 8 && (
                <div className="mt-4 rounded-2xl bg-leaf-soft p-4 text-sm">
                  <p className="flex items-center gap-1.5 font-semibold text-leaf-dark"><Sparkles size={15} /> AI classification (advisory)</p>
                  <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div><dt className="text-muted">Category</dt><dd className="font-semibold">{ai.category}</dd></div>
                    <div><dt className="text-muted">Subcategory</dt><dd className="font-semibold">{ai.subcategory}</dd></div>
                    <div><dt className="text-muted">Amount</dt><dd className="font-semibold">{ai.amount ?? "—"}</dd></div>
                  </dl>
                </div>
              )}
              <button disabled={draft.description.trim().length < 8} onClick={() => { setDraft((x) => ({ ...x, amount: x.amount || ai.amount || "" })); setStep(1); }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 font-semibold text-white disabled:opacity-40">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <p className="font-semibold">Just a few details</p>
              <p className="text-sm text-muted">Only what&apos;s needed to route your case.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">Name of your cooperative<input className={field} value={draft.cooperative} onChange={set("cooperative")} placeholder="ABC PACS" /></label>
                <label className="text-sm">District<input className={field} value={draft.district} onChange={set("district")} placeholder="Jamtara" /></label>
                <label className="text-sm">State
                  <select className={field} value={draft.state} onChange={set("state")}>
                    <option value="">Select…</option>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="text-sm">When did it happen?<input className={field} value={draft.when} onChange={set("when")} placeholder="About six months ago" /></label>
                <label className="text-sm">Amount involved (optional)<input className={field} value={draft.amount} onChange={set("amount")} placeholder="₹20,000" /></label>
              </div>
              <div className="mt-5 rounded-2xl bg-turmeric-soft p-4 text-sm">
                <p className="font-semibold">Keep these documents ready</p>
                <ul className="mt-1 list-inside list-disc text-muted">{ai.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(0)} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-semibold"><ArrowLeft size={16} /> Back</button>
                <button disabled={!detailsDone} onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 font-semibold text-white disabled:opacity-40">Review <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-3xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">Your formal grievance</p>
                <div className="flex rounded-full bg-sand p-1 text-sm">
                  {LANGS.map((l) => (
                    <button key={l.id} onClick={() => setLang(l.id)} className={`rounded-full px-3 py-1 ${lang === l.id ? "bg-white font-semibold shadow-sm" : "text-muted"}`}>{l.label}</button>
                  ))}
                </div>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-cream p-5 font-sans text-sm leading-relaxed ring-1 ring-line">
                {letter({ ...draft, ...ai }, lang)}
              </pre>
              <label className="mt-5 flex items-start gap-3 text-sm">
                <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} className="mt-0.5 h-5 w-5 accent-leaf" />
                I have reviewed these details and they are correct.
              </label>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-semibold"><ArrowLeft size={16} /> Edit</button>
                <button disabled={!reviewed} onClick={submit} className="rounded-full bg-leaf px-5 py-3 font-semibold text-white disabled:opacity-40">Generate grievance & tracking ID</button>
              </div>
            </div>
          )}

          {step === 3 && created && (
            <div className="rounded-3xl border border-line bg-white p-6 text-center">
              <CheckCircle2 size={48} className="mx-auto text-leaf" />
              <p className="mt-4 text-sm text-muted">Your tracking ID</p>
              <p className="font-mono text-3xl font-bold">{created.id}</p>
              <p className="mt-2 inline-block rounded-full bg-leaf-soft px-3 py-1 text-sm font-semibold text-leaf-dark">Status: {created.status}</p>
              <p className="mx-auto mt-5 max-w-md text-xs text-muted">
                Prototype: this case is saved in your browser and visible on the demo authority dashboard. It has not been sent to
                any government or cooperative system.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-semibold"><Printer size={16} /> Print letter</button>
                <Link href="/admin" className="rounded-full bg-ink px-5 py-3 font-semibold text-white">Open authority view</Link>
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
  const [found, setFound] = useState<Grievance | null | undefined>(undefined);
  return (
    <div className="mt-8 rounded-3xl border border-line bg-white p-6">
      <form onSubmit={(e) => { e.preventDefault(); setFound(loadGrievances().find((g) => g.id === id.trim().toUpperCase()) ?? null); }} className="flex gap-2">
        <label htmlFor="gid" className="sr-only">Tracking ID</label>
        <input id="gid" value={id} onChange={(e) => setId(e.target.value)} placeholder="GRV-2026-00421" className="h-12 flex-1 rounded-full border border-line px-5 font-mono outline-none focus:border-leaf" />
        <button className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 font-semibold text-white"><Search size={16} /> Track</button>
      </form>
      {found === null && <p className="mt-4 text-sm text-brick">No grievance found with that ID.</p>}
      {found && (
        <div className="mt-6">
          <p className="font-mono font-bold">{found.id}</p>
          <p className="text-sm text-muted">{found.category} · {found.subcategory} · {found.cooperative}, {found.district}</p>
          <ol className="mt-5 space-y-3">
            {STATUSES.map((s) => {
              const h = found.history.find((x) => x.status === s);
              const reached = STATUSES.indexOf(s) <= STATUSES.indexOf(found.status);
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className={`h-3 w-3 rounded-full ${reached ? "bg-leaf" : "bg-line"}`} />
                  <span className={reached ? "font-semibold" : "text-muted"}>{s}</span>
                  {h && <span className="text-xs text-muted">{new Date(h.at).toLocaleDateString("en-IN")}{h.note ? ` — ${h.note}` : ""}</span>}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
