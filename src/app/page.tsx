import Link from "next/link";
import {
  ArrowRight, BadgeCheck, BookOpenCheck, Camera, ClipboardList, Cpu, FileSearch, Gavel, Landmark,
  LayoutDashboard, Mic, ScanText, ShieldAlert, Sprout, Volume2, Wallet, Wifi, WifiOff,
} from "lucide-react";
import EvidenceBadge from "@/components/EvidenceBadge";

const modules = [
  { icon: Gavel, title: "Governance assistant", text: "Membership, voting, elections, general body meetings and by-laws — explained simply." },
  { icon: Landmark, title: "Jurisdiction-aware legal RAG", text: "Answers filtered by state, central or multi-state scope and cooperative type — never by similarity alone." },
  { icon: BadgeCheck, title: "Know your rights", text: "Maps your question to the right, the applicable source and the next thing you can actually do." },
  { icon: ClipboardList, title: "Conversational grievances", text: "Describe the problem in your words. AI structures it, asks only what's missing, and gives a tracking ID." },
  { icon: ScanText, title: "Document intelligence", text: "Photograph a notice or receipt. OCR + AI explain what it says and what to verify." },
  { icon: Wallet, title: "Financial literacy", text: "Loans, interest, deposits and shares in plain language — with fraud-safety warnings built in." },
  { icon: LayoutDashboard, title: "Authority dashboard", text: "AI summaries, categories, missing-evidence checklists and trends for faster, fairer resolution." },
];

const pipeline = ["Language", "Intent", "Jurisdiction", "Cooperative type", "Verified retrieval", "Evidence check", "Simple answer + source", "Next steps"];

const lifecycle = ["Created", "Submitted", "Under review", "Info requested", "Forwarded", "Resolved"];

const stack = ["Next.js", "TypeScript", "Tailwind CSS", "PWA", "FastAPI", "PostgreSQL", "Redis", "Qdrant", "Whisper STT", "Multilingual TTS", "OCR", "Docker", "Raspberry Pi"];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-leaf-soft blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-64 h-72 w-72 rounded-full bg-turmeric-soft blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-turmeric" /> Smart India Hackathon 2026 · PS 26088
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Your cooperative rights,
              <br />
              <span className="text-leaf">in your language,</span>
              <br />
              in your voice.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              SahyogAI is a voice-first assistant for cooperative members, PACS users and farmers. It answers from verified
              government sources, explains documents, and turns a spoken problem into a tracked grievance.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm" lang="mul">
              {["हिंदी", "বাংলা", "English"].map((l) => (
                <span key={l} className="rounded-full bg-white px-3 py-1 font-medium shadow-sm ring-1 ring-line">{l}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assistant" className="group inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-leaf-dark">
                <Mic size={18} /> Ask a question
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link href="/grievance" className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 font-semibold transition hover:border-ink/40">
                📝 शिकायत दर्ज करें
              </Link>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="rounded-[28px] border border-line bg-white p-5 shadow-[0_30px_60px_-30px_rgba(21,35,27,0.35)]">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-semibold text-ink">SahyogAI</span>
                <span className="rounded-full bg-sand px-2 py-0.5">বাংলা</span>
              </div>
              <div className="mt-4 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-leaf px-4 py-2.5 text-sm text-white" lang="bn">
                আমার সমবায় সমিতি আমাকে ভোট দিতে দিচ্ছে না।
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {["Bengali", "Governance", "Voting rights", "West Bengal · PACS"].map((t) => (
                  <span key={t} className="rounded-md bg-sand px-2 py-0.5 text-muted">{t}</span>
                ))}
              </div>
              <div className="mt-3 rounded-2xl rounded-bl-md border border-line bg-cream p-4 text-sm">
                <EvidenceBadge level="strong" />
                <p className="mt-2" lang="bn">নিবন্ধিত সদস্য যিনি উপবিধির শর্ত পূরণ করেন, সাধারণ সভার নির্বাচনে ভোট দিতে পারেন।</p>
                <div className="mt-3 rounded-xl bg-white p-3 text-xs text-muted ring-1 ring-line">
                  <p className="font-semibold text-ink">Verified source</p>
                  <p>State Cooperative Societies Act & Rules · Jurisdiction matched</p>
                </div>
                <div className="mt-3 w-full rounded-xl bg-turmeric px-3 py-2 text-center text-xs font-semibold text-white">
                  Create a grievance?
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:flex">
              <span className="relative flex h-9 w-9 items-center justify-center text-leaf">
                <span className="pulse-ring absolute inset-0" />
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-leaf text-white"><Volume2 size={16} /></span>
              </span>
              <div className="text-xs">
                <p className="font-semibold">Speaking answer…</p>
                <p className="text-muted">Text shown too, for transparency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXT STRIP */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-sm sm:px-6 md:grid-cols-4">
          {[
            ["Ministry of Cooperation", "Organisation"],
            ["NCCT", "Department"],
            ["Agriculture, FoodTech & Rural Dev.", "Theme"],
            ["Web / PWA + Pi kiosk", "Platform"],
          ].map(([v, k]) => (
            <div key={k}>
              <p className="text-xs uppercase tracking-wider text-muted">{k}</p>
              <p className="mt-1 font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NORTH STAR */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">Built around three questions</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything a rural member needs, and nothing that gets in the way.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["“What is my right?”", "Governance + legal RAG over verified cooperative law.", BookOpenCheck],
            ["“What should I do?”", "Actionable next steps and help understanding documents.", Sprout],
            ["“How do I raise my issue?”", "Conversational grievance creation and tracking.", ClipboardList],
          ].map(([q, a, Icon]) => {
            const I = Icon as typeof Sprout;
            return (
              <div key={q as string} className="rounded-3xl border border-line bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-soft text-leaf"><I size={20} /></span>
                <p className="mt-5 font-display text-2xl font-semibold">{q as string}</p>
                <p className="mt-2 text-muted">{a as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 bg-sand/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">Core modules</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Seven modules, one assistant.</h2>
            </div>
            <Link href="/assistant" className="inline-flex items-center gap-1 text-sm font-semibold text-leaf hover:underline">
              Try the demo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className={`group rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${i === 0 ? "lg:col-span-2" : ""}`}>
                <Icon className="text-leaf" size={22} />
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-ink p-6 text-cream">
              <ShieldAlert className="text-turmeric" size={22} />
              <h3 className="mt-4 text-lg font-semibold">Won&apos;t make things up</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/75">
                No invented sections, deadlines, eligibility or submission status. If sources are thin, it says so.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">How it works</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          The LLM is not the source of truth. Verified documents are.
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Generic chatbot</p>
            <ol className="mt-5 flex items-center gap-3 text-sm">
              {["Question", "LLM", "Answer?"].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="rounded-xl bg-sand px-3 py-2">{s}</span>
                  {i < 2 && <ArrowRight size={14} className="text-muted" />}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-muted">Fluent, but unsourced — and it doesn&apos;t know which state&apos;s law applies to you.</p>
          </div>
          <div className="rounded-3xl border-2 border-leaf bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-leaf">SahyogAI</p>
            <ol className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              {pipeline.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className={`rounded-xl px-3 py-2 ${i === pipeline.length - 1 ? "bg-leaf text-white" : "bg-leaf-soft text-leaf-dark"}`}>{s}</span>
                  {i < pipeline.length - 1 && <ArrowRight size={14} className="text-leaf/60" />}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {([
            ["strong", "Directly supported by an authoritative, jurisdiction-matched source."],
            ["limited", "Related official information exists, but applicability is uncertain — it asks for your state or society type."],
            ["insufficient", "Not enough reliable information. It tells you so instead of guessing."],
          ] as const).map(([lvl, t]) => (
            <div key={lvl} className="rounded-2xl border border-line bg-white p-5">
              <EvidenceBadge level={lvl} />
              <p className="mt-3 text-sm text-muted">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GRIEVANCE LIFECYCLE */}
      <section className="bg-leaf text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">Grievance redressal</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">From a spoken complaint to a tracked case.</h2>
            <p className="mt-4 text-cream/80">
              “Meri cooperative ne mera ₹20,000 ka deposit return nahi kiya.” SahyogAI detects the category, amount and missing
              details, asks only what&apos;s needed, drafts a formal letter in Hindi, Bengali or English, and gives you an ID.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/grievance" className="rounded-full bg-cream px-5 py-3 font-semibold text-leaf-dark transition hover:bg-white">File a grievance</Link>
              <Link href="/admin" className="rounded-full border border-cream/40 px-5 py-3 font-semibold transition hover:border-cream">See authority view</Link>
            </div>
          </div>
          <div className="rounded-3xl bg-leaf-dark/60 p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm">GRV-2026-00421</p>
              <span className="rounded-full bg-turmeric px-2.5 py-1 text-xs font-semibold text-ink">Under review</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              {[["Category", "Financial"], ["Subcategory", "Deposit repayment"], ["Cooperative", "ABC PACS"], ["District", "Jamtara"], ["Amount", "₹20,000"], ["Language", "Hindi"]].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-cream/60">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <ol className="mt-7 grid grid-cols-6 gap-1.5">
              {lifecycle.map((s, i) => (
                <li key={s}>
                  <span className={`block h-1.5 rounded-full ${i <= 2 ? "bg-turmeric" : "bg-white/15"}`} />
                  <span className="mt-2 block text-[10px] leading-tight text-cream/70 sm:text-xs">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* KIOSK */}
      <section id="kiosk" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-sm rounded-[32px] border-[10px] border-ink bg-cream p-6 text-center shadow-2xl">
              <p className="font-semibold">SahyogAI</p>
              <p className="mt-4 text-sm text-muted">How can we help you?</p>
              <span className="relative mx-auto mt-6 flex h-24 w-24 items-center justify-center text-leaf">
                <span className="pulse-ring absolute inset-0" />
                <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-leaf text-white shadow-lg"><Mic size={36} /></span>
              </span>
              <p className="mt-4 font-semibold">Speak here · यहाँ बोलें</p>
              <div className="mt-5 flex justify-center gap-2 text-xs">
                {["हिंदी", "বাংলা", "English"].map((l) => <span key={l} className="rounded-full bg-white px-3 py-1 ring-1 ring-line">{l}</span>)}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                {["⚖️ Rights", "📝 Grievance", "📄 Document", "💰 Finance"].map((b) => <span key={b} className="rounded-xl bg-white py-3 font-medium ring-1 ring-line">{b}</span>)}
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">Raspberry Pi kiosk</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">A big microphone button in the village office.</h2>
            <p className="mt-4 text-muted">
              For members with limited digital literacy: large buttons, minimal text, audio feedback and visible progress. The Pi
              runs the interface and peripherals; AI stays in the cloud for the MVP.
            </p>
            <Link href="/kiosk" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-leaf hover:underline">
              Open kiosk mode <ArrowRight size={14} />
            </Link>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {[[Cpu, "Raspberry Pi + display"], [Mic, "USB / I2S microphone"], [Volume2, "Speaker"], [Camera, "Optional document camera"], [Wifi, "Wi-Fi connectivity"], [FileSearch, "Same backend as web"]].map(([Icon, t]) => {
                const I = Icon as typeof Cpu;
                return (
                  <li key={t as string} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                    <I size={18} className="shrink-0 text-leaf" /> {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ROADMAP + STACK */}
      <section className="bg-sand/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-turmeric">Edge-ready roadmap</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Cloud today. Offline tomorrow.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [Wifi, "MVP", "Cloud-assisted", "Kiosk → cloud STT → RAG + AI → TTS. Fastest path to a reliable demo.", true],
              [Cpu, "Next", "Hybrid", "Frequently used knowledge cached on the kiosk; cloud AI for complex queries.", false],
              [WifiOff, "Future", "Offline-first", "Local OCR, STT, TTS, lightweight RAG and small language models. Internet for sync.", false],
            ].map(([Icon, tag, title, text, now]) => {
              const I = Icon as typeof Cpu;
              return (
                <div key={title as string} className={`rounded-3xl p-6 ${now ? "bg-ink text-cream" : "border border-line bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <I size={20} className={now ? "text-turmeric" : "text-leaf"} />
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${now ? "bg-turmeric text-ink" : "bg-sand text-muted"}`}>{tag as string}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{title as string}</h3>
                  <p className={`mt-1.5 text-sm ${now ? "text-cream/75" : "text-muted"}`}>{text as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-14 text-center text-cream sm:px-16">
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-leaf/40 blur-3xl" />
          <p className="relative font-display text-3xl font-semibold leading-snug sm:text-4xl">
            “Turn a rural member&apos;s voice into verified cooperative guidance — in their own language.”
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/assistant" className="inline-flex items-center gap-2 rounded-full bg-turmeric px-6 py-3.5 font-semibold text-ink transition hover:brightness-105">
              <Mic size={18} /> Try the assistant
            </Link>
            <Link href="/admin" className="rounded-full border border-cream/30 px-6 py-3.5 font-semibold transition hover:border-cream">
              Authority dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
