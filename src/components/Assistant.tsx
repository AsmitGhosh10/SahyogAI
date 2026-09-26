"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, ExternalLink, FileText, Loader2, Mic, MicOff, Send, Square, Volume2 } from "lucide-react";
import EvidenceBadge from "@/components/EvidenceBadge";
import { COOP_TYPES, LANGS, langName, speechLang, STATES, type ChatResponse, type ChatTurn, type Lang } from "@/lib/shared";
import { getRecognition, speak, stopSpeaking } from "@/lib/speech";

type Msg = { role: "user"; text: string } | { role: "ai"; data: ChatResponse; question: string } | { role: "error"; text: string };

const STAGES = ["Understanding…", "Searching verified sources…", "Preparing answer…"];

const SUGGEST: Record<Lang, string[]> = {
  en: ["Can a cooperative member vote in the election?", "My cooperative has not returned my deposit.", "Someone is asking for my OTP to release my payment."],
  hi: ["क्या सहकारी समिति का सदस्य चुनाव में वोट दे सकता है?", "Mera PACS loan ka repayment kaise hoga?", "₹50,000 loan at 10% interest ka kya matlab hai?"],
  bn: ["আমার সমবায় সমিতি আমাকে ভোট দিতে দিচ্ছে না।", "আমার PACS থেকে loan নিতে কী লাগবে?", "সদস্য হিসেবে আমার অধিকার কী?"],
};

export const UI: Record<Lang, { title: string; hint: string; placeholder: string; listen: string; grievance: string; speakHere: string; noVoice: string; newChat: string }> = {
  en: { title: "How can we help?", hint: "Tap the mic and speak, or type your question.", placeholder: "Type your question…", listen: "Listen", grievance: "📝 Create a grievance", speakHere: "Speak your question", noVoice: "No voice installed for this language on this device — please read the answer.", newChat: "New question" },
  hi: { title: "हम कैसे मदद करें?", hint: "माइक दबाकर बोलें या अपना सवाल लिखें।", placeholder: "अपना सवाल लिखें…", listen: "सुनें", grievance: "📝 शिकायत दर्ज करें", speakHere: "अपना सवाल बोलें", noVoice: "इस डिवाइस पर इस भाषा की आवाज़ नहीं है — कृपया उत्तर पढ़ें।", newChat: "नया सवाल" },
  bn: { title: "কীভাবে সাহায্য করব?", hint: "মাইক চেপে বলুন বা প্রশ্ন লিখুন।", placeholder: "আপনার প্রশ্ন লিখুন…", listen: "শুনুন", grievance: "📝 অভিযোগ জানান", speakHere: "আপনার প্রশ্ন বলুন", noVoice: "এই ডিভাইসে এই ভাষার ভয়েস নেই — অনুগ্রহ করে উত্তর পড়ুন।", newChat: "নতুন প্রশ্ন" },
};

export default function Assistant({ kiosk = false }: { kiosk?: boolean }) {
  const [lang, setLang] = useState<Lang>("hi");
  const [state, setState] = useState("");
  const [coop, setCoop] = useState("");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stage, setStage] = useState(-1);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [voiceMissing, setVoiceMissing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<ReturnType<typeof getRecognition>>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, stage]);

  // Voices load asynchronously in Chromium; touching the list early makes them available when an answer arrives.
  useEffect(() => {
    window.speechSynthesis?.getVoices();
  }, []);

  function history(): ChatTurn[] {
    return msgs
      .filter((m) => m.role !== "error")
      .slice(-8)
      .map((m) => (m.role === "user" ? { role: "user", text: m.text } : { role: "assistant", text: (m as Extract<Msg, { role: "ai" }>).data.answer }));
  }

  function say(r: ChatResponse) {
    setVoiceMissing(!speak([r.answer, ...r.steps].join(" "), speechLang(r.language)));
  }

  async function ask(text: string, fromVoice = false) {
    const q = text.trim();
    if (!q || stage >= 0) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setStage(0);
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 1400);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, language: lang, state, cooperative_type: coop, history: history() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ChatResponse;
      setMsgs((m) => [...m, { role: "ai", data, question: q }]);
      if (fromVoice || kiosk) say(data);
    } catch {
      setMsgs((m) => [...m, { role: "error", text: "Could not reach the server. Check the internet connection and try again." }]);
    } finally {
      clearInterval(timer);
      setStage(-1);
    }
  }

  function toggleMic() {
    if (listening) return recRef.current?.stop();
    stopSpeaking();
    const r = getRecognition(speechLang(lang));
    if (!r) return setMicError("Voice input isn't supported in this browser — use Chrome or Edge, or type your question.");
    setMicError("");
    recRef.current = r;
    r.onresult = (e) => ask(e.results[0][0].transcript, true);
    r.onend = () => setListening(false);
    r.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed") setMicError("Microphone permission was blocked. Allow it in the browser's address bar.");
      else if (e.error !== "no-speech" && e.error !== "aborted") setMicError("Could not hear clearly. Please try again.");
    };
    setListening(true);
    r.start();
  }

  const ui = UI[lang];
  const select = `rounded-xl border border-line bg-white px-3 ${kiosk ? "py-3 text-base" : "py-2 text-sm"}`;
  const bigMic = kiosk ? "h-44 w-44" : "h-32 w-32";

  return (
    <div className={`mx-auto flex max-w-3xl flex-col px-4 sm:px-6 ${kiosk ? "min-h-screen" : "min-h-[calc(100vh-4rem)]"}`}>
      <div className={`sticky z-10 -mx-4 flex flex-wrap items-center gap-2 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 ${kiosk ? "top-0" : "top-16"}`}>
        <div role="radiogroup" aria-label="Language" className="flex rounded-full bg-white p-1 ring-1 ring-line">
          {LANGS.map((l) => (
            <button key={l.id} role="radio" aria-checked={lang === l.id} onClick={() => setLang(l.id)}
              className={`rounded-full font-medium transition ${kiosk ? "px-5 py-2.5 text-lg" : "px-3.5 py-1.5 text-sm"} ${lang === l.id ? "bg-leaf text-white" : "text-muted hover:text-ink"}`}>
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
        {msgs.length > 0 && (
          <button onClick={() => { stopSpeaking(); setMsgs([]); }} className="ml-auto rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold">
            {ui.newChat}
          </button>
        )}
      </div>

      <div className="flex-1 py-6" aria-live="polite">
        {msgs.length === 0 && stage < 0 && (
          <div className="flex flex-col items-center pt-8 text-center">
            <h1 className={`font-display font-semibold ${kiosk ? "text-5xl" : "text-3xl sm:text-4xl"}`}>{ui.title}</h1>
            <p className={`mt-2 text-muted ${kiosk ? "text-xl" : ""}`}>{ui.hint}</p>
            <button onClick={toggleMic} aria-label={listening ? "Stop listening" : "Start speaking"}
              className={`relative mt-10 flex items-center justify-center rounded-full ${bigMic} ${listening ? "text-brick" : "text-leaf"}`}>
              {listening && <span className="pulse-ring absolute inset-0" />}
              <span className={`relative flex items-center justify-center rounded-full text-white shadow-xl transition ${bigMic} ${listening ? "bg-brick" : "bg-leaf hover:bg-leaf-dark"}`}>
                <Mic size={kiosk ? 64 : 48} />
              </span>
            </button>
            <p className={`mt-4 font-semibold ${kiosk ? "text-2xl" : "text-sm"}`}>{listening ? "🎤 Recording…" : ui.speakHere}</p>
            {micError && <p className="mt-2 max-w-sm text-sm text-brick">{micError}</p>}
            <div className="mt-10 flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGEST[lang].map((s) => (
                <button key={s} onClick={() => ask(s)} className={`rounded-full border border-line bg-white px-4 py-2 transition hover:border-leaf hover:text-leaf ${kiosk ? "text-lg" : "text-sm"}`}>{s}</button>
              ))}
            </div>
            {kiosk && (
              <div className="mt-10 grid w-full max-w-lg grid-cols-2 gap-3 text-lg font-semibold">
                {[["/grievance", "📝 Grievance"], ["/documents", "📄 Document"], ["/finance", "💰 Finance"], ["/grievance#track", "🔎 Track case"]].map(([href, label]) => (
                  <Link key={href} href={href} className="rounded-2xl bg-white py-5 ring-1 ring-line hover:ring-leaf">{label}</Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-5">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className={`ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-leaf px-4 py-3 text-white ${kiosk ? "text-xl" : ""}`}>{m.text}</div>
            ) : m.role === "error" ? (
              <p key={i} className="flex items-center gap-2 rounded-2xl bg-brick-soft px-4 py-3 text-sm text-brick"><AlertCircle size={16} /> {m.text}</p>
            ) : (
              <AnswerCard key={i} m={m} onListen={() => say(m.data)} kiosk={kiosk} />
            ),
          )}
          {voiceMissing && <p className="text-xs text-muted">{UI[lang].noVoice}</p>}
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

      <form onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="sticky bottom-0 -mx-4 flex items-center gap-2 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <button type="button" onClick={toggleMic} aria-label={listening ? "Stop listening" : "Speak"}
          className={`flex shrink-0 items-center justify-center rounded-full text-white ${kiosk ? "h-16 w-16" : "h-12 w-12"} ${listening ? "bg-brick" : "bg-leaf"}`}>
          {listening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        <label htmlFor="q" className="sr-only">Your question</label>
        <input id="q" value={input} onChange={(e) => setInput(e.target.value)} placeholder={ui.placeholder} maxLength={2000}
          className={`min-w-0 flex-1 rounded-full border border-line bg-white px-5 outline-none focus:border-leaf ${kiosk ? "h-16 text-lg" : "h-12"}`} />
        <button type="submit" aria-label="Send" disabled={!input.trim() || stage >= 0}
          className={`flex shrink-0 items-center justify-center rounded-full bg-ink text-white disabled:opacity-30 ${kiosk ? "h-16 w-16" : "h-12 w-12"}`}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

function AnswerCard({ m, onListen, kiosk }: { m: Extract<Msg, { role: "ai" }>; onListen: () => void; kiosk: boolean }) {
  const { data } = m;
  const ui = UI[data.language];
  return (
    <div className={`max-w-[95%] rounded-2xl rounded-bl-md border bg-white p-5 ${data.safety_warning ? "border-brick/40" : "border-line"}`}>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {[langName(data.language), data.intent, data.topic, data.kind === "legal" ? `Jurisdiction: ${data.jurisdiction}` : ""].filter(Boolean).map((t) => (
          <span key={t} className="rounded-md bg-sand px-2 py-0.5 capitalize text-muted">{t}</span>
        ))}
        {data.mode === "demo" && <span className="rounded-md bg-turmeric-soft px-2 py-0.5 text-[#8a520c]">Offline keyword mode</span>}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {data.safety_warning ? (
          <span className="rounded-full bg-brick px-2.5 py-1 text-xs font-bold text-white">⚠️ SAFETY WARNING</span>
        ) : data.kind === "legal" ? (
          <EvidenceBadge level={data.evidence} />
        ) : (
          <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-muted">General information</span>
        )}
        <div className="flex gap-1.5">
          <button onClick={onListen} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold hover:border-leaf hover:text-leaf">
            <Volume2 size={14} /> {ui.listen}
          </button>
          <button onClick={stopSpeaking} aria-label="Stop speaking" className="rounded-full border border-line px-2 py-1 hover:border-brick hover:text-brick"><Square size={12} /></button>
        </div>
      </div>
      <p className={`mt-3 whitespace-pre-line leading-relaxed ${kiosk ? "text-xl" : ""}`}>{data.answer}</p>
      {data.steps.length > 0 && (
        <ol className="mt-4 space-y-2">
          {data.steps.map((s, i) => (
            <li key={i} className={`flex gap-3 ${kiosk ? "text-lg" : "text-sm"}`}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-xs font-bold text-leaf-dark">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      )}
      {data.clarifying_question && <p className="mt-4 rounded-xl bg-turmeric-soft px-3 py-2 text-sm text-[#8a520c]">{data.clarifying_question}</p>}
      {data.sources.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"><FileText size={13} /> Verified source{data.sources.length > 1 ? "s" : ""}</p>
          {data.sources.map((s, i) => (
            <details key={i} className="rounded-xl bg-cream p-3 text-xs ring-1 ring-line">
              <summary className="cursor-pointer font-semibold text-ink">
                {s.title}{s.section ? ` — ${s.section}` : ""}{s.page ? ` (p. ${s.page})` : ""}
              </summary>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted">
                <dt>Authority</dt><dd>{s.authority}</dd>
                <dt>Jurisdiction</dt><dd>{s.jurisdiction}</dd>
                <dt>Applies to</dt><dd>{s.applies_to}</dd>
                <dt>Last verified</dt><dd>{s.last_verified}</dd>
              </dl>
              <blockquote className="mt-2 border-l-2 border-leaf pl-3 text-ink/80">{s.excerpt}…</blockquote>
              {s.source_url && (
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-leaf hover:underline">
                  Open official document <ExternalLink size={12} />
                </a>
              )}
            </details>
          ))}
        </div>
      )}
      {data.offer_grievance && (
        <Link href={`/grievance?d=${encodeURIComponent(m.question)}`} className="mt-4 inline-flex rounded-full bg-turmeric px-4 py-2 text-sm font-semibold text-ink hover:brightness-105">
          {ui.grievance}
        </Link>
      )}
      <p className="mt-4 text-[11px] text-muted">Information only — not legal or financial advice.</p>
    </div>
  );
}
