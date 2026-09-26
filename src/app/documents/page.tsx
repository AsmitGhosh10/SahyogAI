"use client";

import { useState } from "react";
import { Camera, ExternalLink, FileText, Loader2, ScanText, Volume2 } from "lucide-react";
import { LANGS, speechLang, type DocumentAnalysis, type Lang } from "@/lib/shared";
import { speak } from "@/lib/speech";

export default function DocumentsPage() {
  const [lang, setLang] = useState<Lang>("hi");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<DocumentAnalysis | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function pick(f: File | null) {
    setFile(f);
    setResult(null);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f && f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
  }

  async function analyse() {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return setError("File is larger than 10 MB.");
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("language", lang);
    const res = await fetch("/api/documents/analyze", { method: "POST", body: fd }).catch(() => null);
    const json = await res?.json().catch(() => ({}));
    setBusy(false);
    if (res?.ok) setResult(json);
    else setError(json?.error || "Could not reach the server.");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">📄 Understand a document</h1>
      <p className="mt-2 text-muted">Photograph a notice, receipt, loan paper or form. SahyogAI reads it and explains it simply. Files are not stored.</p>

      <div className="mt-8 rounded-3xl border border-line bg-white p-6">
        <div className="flex rounded-full bg-sand p-1 text-sm w-fit">
          {LANGS.map((l) => (
            <button key={l.id} onClick={() => setLang(l.id)} className={`rounded-full px-3 py-1 ${lang === l.id ? "bg-white font-semibold shadow-sm" : "text-muted"}`}>{l.label}</button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-6 text-center hover:border-leaf">
            <Camera size={28} className="text-leaf" />
            <span className="font-semibold">Take a photo</span>
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
          </label>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-6 text-center hover:border-leaf">
            <FileText size={28} className="text-leaf" />
            <span className="font-semibold">Upload photo or PDF</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {file && (
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            {preview ? <img src={preview} alt="Selected document" className="h-28 rounded-xl object-cover ring-1 ring-line" /> : <span className="rounded-xl bg-sand px-3 py-2 text-sm">{file.name}</span>}
            <button onClick={analyse} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 font-semibold text-white disabled:opacity-40">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <ScanText size={16} />} {busy ? "Reading…" : "Explain this document"}
            </button>
          </div>
        )}
        {error && <p role="alert" className="mt-4 rounded-2xl bg-brick-soft px-4 py-3 text-sm text-brick">{error}</p>}
      </div>

      {result && (
        <div className="mt-6 rounded-3xl border border-line bg-white p-6" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Document analysis</p>
            <button onClick={() => speak(`${result.meaning} ${result.suggested_action}`, speechLang(lang))} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold">
              <Volume2 size={14} /> Listen
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted">Document type</dt><dd className="font-semibold">{result.document_type}</dd></div>
            <div><dt className="text-muted">Language</dt><dd className="font-semibold">{result.language}</dd></div>
          </dl>
          <h2 className="mt-5 font-semibold">Important points</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">{result.key_points.map((p, i) => <li key={i}>{p}</li>)}</ul>
          <h2 className="mt-5 font-semibold">What this means</h2>
          <p className="mt-1 text-sm leading-relaxed">{result.meaning}</p>
          <h2 className="mt-5 font-semibold">Things to verify</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">{result.things_to_verify.map((p, i) => <li key={i}>{p}</li>)}</ul>
          <p className="mt-5 rounded-2xl bg-leaf-soft p-4 text-sm"><span className="font-semibold">Next step: </span>{result.suggested_action}</p>
          {result.sources.length > 0 && (
            <div className="mt-5 text-sm">
              <h2 className="font-semibold">Possibly related rules in the knowledge base</h2>
              <ul className="mt-2 space-y-2">
                {result.sources.map((s, i) => (
                  <li key={i} className="rounded-xl bg-cream p-3 text-xs ring-1 ring-line">
                    <p className="font-semibold">{s.title}{s.section ? ` — ${s.section}` : ""}</p>
                    <p className="mt-1 text-muted">{s.excerpt}…</p>
                    {s.source_url && <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-leaf">Official source <ExternalLink size={11} /></a>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-5 text-[11px] text-muted">This explains the document. It is not a legal determination.</p>
        </div>
      )}
    </div>
  );
}
