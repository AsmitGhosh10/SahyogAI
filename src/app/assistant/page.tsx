"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, FileText, Loader2, Mic, MicOff, Send, Volume2 } from "lucide-react";
import EvidenceBadge from "@/components/EvidenceBadge";
import { answer, ASK_STATE, COOP_TYPES, detectLang, LANGS, STATES, type Answer, type Lang } from "@/lib/demo";
import { getRecognition, speak } from "@/lib/speech";

type Msg = { role: "user"; text: string } | { role: "ai"; data: Answer; lang: Lang; question: string };

const STAGES = ["Understanding…", "Searching verified sources…", "Preparing answer…"];

const SUGGEST: Record<Lang, string[]> = {
  en: ["Can a cooperative member vote in the election?", "My cooperative has not returned my deposit.", "Someone is asking for my OTP to release my payment."],
  hi: ["क्या सहकारी समिति का सदस्य चुनाव में वोट दे सकता है?", "Mera PACS loan ka repayment kaise hoga?", "₹50,000 loan at 10% interest ka kya matlab hai?"],
  bn: ["আমার সমবায় সমিতি আমাকে ভোট দিতে দিচ্ছে না।", "আমার PACS থেকে loan নিতে কী লাগবে?", "সদস্য হিসেবে আমার অধিকার কী?"],
};

const UI: Record<Lang, { title: string; hint: string; placeholder: string; speakBtn: string; grievance: string }> = {
  en: { title: "How can we help?", hint: "Tap the mic and speak, or type your question.", placeholder: "Type your question…", speakBtn: "Listen", grievance: "Create a grievance" },
  hi: { title: "हम कैसे मदद करें?", hint: "माइक दबाकर बोलें या अपना सवाल लिखें।", placeholder: "अपना सवाल लिखें…", speakBtn: "सुनें", grievance: "📝 शिकायत दर्ज करें" },
  bn: { title: "কীভাবে সাহায্য করব?", hint: "মাইক চেপে বলুন বা প্রশ্ন লিখুন।", placeholder: "আপনার প্রশ্ন লিখুন…", speakBtn: "শুনুন", grievance: "📝 অভিযোগ জানান" },
};

const speechLang = (l: Lang) => LANGS.find((x) => x.id === l)!.speech;

export default function Assistant() {
  const [lang, setLang] = useState<Lang>("hi");
  const [state, setState] = useState("");
  const [coop, setCoop] = useState("");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stage, setStage] = useState(-1);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<ReturnType<typeof getRecognition>>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, stage]);

  async function ask(text: string, fromVoice = false) {
    const q = text.trim();
    if (!q || stage >= 0) return;
    setInput("");
    // Respond in the language the user actually used when it differs from the selection (mixed-language support).
    const l = detectLang(q) === "en" ? lang : detectLang(q);
    setMsgs((m) => [...m, { role: "user", text: q }]);
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, 550));
    }
    const data = answer(q, l, state, coop);
    setStage(-1);
    setMsgs((m) => [...m, { role: "ai", data, lang: l, question: q }]);
    if (fromVoice) speak(data.text, speechLang(l));
  }

  function toggleMic() {
    if (listening) return recRef.current?.stop();
    const r = getRecognition(speechLang(lang));
    if (!r) return setMicSupported(false);
    recRef.current = r;
    r.onresult = (e) => ask(e.results[0][0].transcript, true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    setListening(true);
    r.start();
  }

  const ui = UI[lang];
  const select = "rounded-xl border border-line bg-white px-3 py-2 text-sm";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 sm:px-6">
      {/* Controls */}
      <div className="sticky top-16 z-10 -mx-4 flex flex-wrap items-center gap-2 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div role="radiogroup" aria-label="Language" className="flex rounded-full bg-white p-1 ring-1 ring-line">
          {LANGS.map((l) => (
            <button
              key={l.id}
              role="radio"
              aria-checked={lang === l.id}
              onClick={() => setLang(l.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${lang === l.id ? "bg-leaf text-white" : "text-muted hover:text-ink"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="state">State</label>
        <select id="state" value={state} onChange={(e) => setState(e.target.value)} className={select}>
          <option value="">State…</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="sr-only" htmlFor="coop">Cooperative type</label>
        <select id="coop" value={coop} onChange={(e) => setCoop(e.target.value)} className={select}>
          <option value="">Cooperative type…</option>
          {COOP_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Conversation */}
      <div className="flex-1 py-6" aria-live="polite">
        {msgs.length === 0 && stage < 0 && (
          <div className="flex flex-col items-center pt-10 text-center">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{ui.title}</h1>
            <p className="mt-2 text-muted">{ui.hint}</p>
            <button
              onClick={toggleMic}
              aria-label={listening ? "Stop listening" : "Start speaking"}
              className={`relative mt-10 flex h-32 w-32 items-center justify-center rounded-full ${listening ? "text-brick" : "text-leaf"}`}
            >
              {listening && <span className="pulse-ring absolute inset-0" />}
              <span className={`relative flex h-32 w-32 items-center justify-center rounded-full text-white shadow-xl transition ${listening ? "bg-brick" : "bg-leaf hover:bg-leaf-dark"}`}>
                <Mic size={48} />
              </span>
            </button>
            <p className="mt-4 text-sm font-semibold">{listening ? "🎤 Recording…" : "Speak your question"}</p>
            {!micSupported && <p className="mt-2 text-xs text-brick">Voice input isn&apos;t supported in this browser — try Chrome or Edge, or type below.</p>}
            <div className="mt-10 flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGEST[lang].map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-full border border-line bg-white px-4 py-2 text-sm transition hover:border-leaf hover:text-leaf">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-leaf px-4 py-3 text-white">{m.text}</div>
            ) : (
              <AnswerCard key={i} m={m} speakLabel={UI[m.lang].speakBtn} grievanceLabel={UI[m.lang].grievance} />
            ),
          )}
          {stage >= 0 && (
            <ol className="w-fit space-y-1.5 rounded-2xl border border-line bg-white px-4 py-3 text-sm">
              {STAGES.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 ${i > stage ? "text-muted/50" : ""}`}>
                  {i < stage ? <Check size={14} className="text-leaf" /> : i === stage ? <Loader2 size={14} className="animate-spin text-leaf" /> : <span className="w-3.5" />}
                  {s}
                </li>
              ))}
            </ol>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="sticky bottom-0 -mx-4 flex items-center gap-2 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
      >
        <button
          type="button"
          onClick={toggleMic}
          aria-label={listening ? "Stop listening" : "Speak"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${listening ? "bg-brick" : "bg-leaf"}`}
        >
          {listening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <label htmlFor="q" className="sr-only">Your question</label>
        <input
          id="q"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={ui.placeholder}
          className="h-12 flex-1 rounded-full border border-line bg-white px-5 outline-none focus:border-leaf"
        />
        <button type="submit" aria-label="Send" disabled={!input.trim() || stage >= 0} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-white disabled:opacity-30">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function AnswerCard({ m, speakLabel, grievanceLabel }: { m: Extract<Msg, { role: "ai" }>; speakLabel: string; grievanceLabel: string }) {
  const { data } = m;
  const langName = { en: "English", hi: "Hindi", bn: "Bengali" }[m.lang];
  return (
    <div className={`max-w-[95%] rounded-2xl rounded-bl-md border bg-white p-5 ${data.warning ? "border-brick/40" : "border-line"}`}>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {[langName, data.intent, data.topic].map((t) => <span key={t} className="rounded-md bg-sand px-2 py-0.5 text-muted">{t}</span>)}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {data.warning ? <span className="rounded-full bg-brick px-2.5 py-1 text-xs font-bold text-white">⚠️ SAFETY WARNING</span> : <EvidenceBadge level={data.evidence} />}
        <button onClick={() => speak(data.text, speechLang(m.lang))} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold hover:border-leaf hover:text-leaf">
          <Volume2 size={14} /> {speakLabel}
        </button>
      </div>
      <p className="mt-3 leading-relaxed">{data.text}</p>
      {data.steps.length > 0 && (
        <ol className="mt-4 space-y-2">
          {data.steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-xs font-bold text-leaf-dark">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      )}
      {data.evidence === "limited" && <p className="mt-4 rounded-xl bg-turmeric-soft px-3 py-2 text-sm text-[#8a520c]">{ASK_STATE[m.lang]}</p>}
      {data.source && (
        <div className="mt-4 rounded-xl bg-cream p-4 text-xs ring-1 ring-line">
          <p className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-ink"><FileText size={13} /> Source</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted">
            <dt>Document</dt><dd className="text-ink">{data.source.doc}</dd>
            <dt>Section</dt><dd>{data.source.section}</dd>
            <dt>Jurisdiction</dt><dd>{data.source.jurisdiction}</dd>
            <dt>Applies to</dt><dd>{data.source.applies}</dd>
            <dt>Last verified</dt><dd>{data.source.verified}</dd>
          </dl>
        </div>
      )}
      {data.offerGrievance && (
        <Link href={`/grievance?d=${encodeURIComponent(m.question)}`} className="mt-4 inline-flex rounded-full bg-turmeric px-4 py-2 text-sm font-semibold text-ink hover:brightness-105">
          {grievanceLabel}
        </Link>
      )}
      <p className="mt-4 text-[11px] text-muted">Information only — not legal or financial advice.</p>
    </div>
  );
}
