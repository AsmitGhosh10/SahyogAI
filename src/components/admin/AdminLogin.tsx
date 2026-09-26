"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }).catch(() => null);
    setBusy(false);
    if (res?.ok) router.refresh();
    else setError(res?.status === 401 ? "Wrong password." : "Could not reach the server.");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <form onSubmit={submit} className="rounded-3xl border border-line bg-white p-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-soft text-leaf"><Lock size={20} /></span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Authority sign-in</h1>
        <p className="mt-1 text-sm text-muted">For cooperative department officials reviewing grievances.</p>
        <label htmlFor="pw" className="mt-6 block text-sm font-semibold">Password</label>
        <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-leaf" />
        {error && <p role="alert" className="mt-3 text-sm text-brick">{error}</p>}
        <button disabled={busy || !password} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf py-3 font-semibold text-white disabled:opacity-40">
          {busy && <Loader2 size={16} className="animate-spin" />} Sign in
        </button>
      </form>
    </div>
  );
}
