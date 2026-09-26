"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { emi, fdMaturity, inr, simpleInterest } from "@/lib/finance";

function Num({ label, value, onChange, suffix, max }: { label: string; value: number; onChange: (n: number) => void; suffix: string; max: number }) {
  return (
    <label className="block text-sm">
      <span className="flex justify-between"><span>{label}</span><span className="font-semibold">{value.toLocaleString("en-IN")} {suffix}</span></span>
      <input type="range" min={suffix === "%" ? 0 : 1} max={max} step={suffix === "₹" ? 1000 : suffix === "%" ? 0.5 : 1} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-leaf" />
      <input type="number" min={0} max={max} value={value} onChange={(e) => onChange(Math.min(max, Math.max(0, Number(e.target.value))))}
        className="mt-1 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-leaf" aria-label={`${label} value`} />
    </label>
  );
}

export default function FinancePage() {
  const [p, setP] = useState(50000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(12);
  const [fdP, setFdP] = useState(20000);
  const [fdRate, setFdRate] = useState(7);
  const [fdMonths, setFdMonths] = useState(24);

  const m = Math.max(1, months);
  const reducing = emi(p, rate, m);
  const flat = simpleInterest(p, rate, m);
  const fd = fdMaturity(fdP, fdRate, Math.max(1, fdMonths));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">💰 Money made simple</h1>
      <p className="mt-2 text-muted">See what a loan really costs, and what a deposit will earn. Education only — not financial advice.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-lg font-semibold">Loan cost · ऋण · ঋণ</h2>
          <div className="mt-5 space-y-5">
            <Num label="Loan amount" value={p} onChange={setP} suffix="₹" max={1000000} />
            <Num label="Interest per year" value={rate} onChange={setRate} suffix="%" max={36} />
            <Num label="Months" value={months} onChange={setMonths} suffix="months" max={120} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-leaf-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">Reducing balance (EMI)</p>
              <p className="mt-2 text-2xl font-bold">{inr(reducing.monthly)}<span className="text-sm font-normal"> / month</span></p>
              <p className="mt-1 text-sm">Interest: {inr(reducing.interest)} · Total: {inr(reducing.total)}</p>
            </div>
            <div className="rounded-2xl bg-turmeric-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8a520c]">Flat / simple interest</p>
              <p className="mt-2 text-2xl font-bold">{inr(flat.monthly)}<span className="text-sm font-normal"> / month</span></p>
              <p className="mt-1 text-sm">Interest: {inr(flat.interest)} · Total: {inr(flat.total)}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Same rate, different method: flat interest costs {inr(flat.interest - reducing.interest)} more here. Always ask your
            PACS or bank which method they use and for all fees in writing.
          </p>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-lg font-semibold">Fixed deposit · जमा · আমানত</h2>
          <div className="mt-5 space-y-5">
            <Num label="Deposit" value={fdP} onChange={setFdP} suffix="₹" max={1000000} />
            <Num label="Interest per year" value={fdRate} onChange={setFdRate} suffix="%" max={15} />
            <Num label="Months" value={fdMonths} onChange={setFdMonths} suffix="months" max={120} />
          </div>
          <div className="mt-6 rounded-2xl bg-leaf-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">At maturity (quarterly compounding)</p>
            <p className="mt-2 text-2xl font-bold">{inr(fd.maturity)}</p>
            <p className="mt-1 text-sm">You earn {inr(fd.interest)}</p>
          </div>
          <p className="mt-4 text-sm text-muted">Keep your deposit receipt safe. If a matured deposit is not returned, you can <Link href="/grievance" className="font-semibold text-leaf">raise a grievance</Link>.</p>
        </section>
      </div>

      <section className="mt-6 rounded-3xl bg-ink p-6 text-cream">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldAlert className="text-turmeric" /> Stay safe from fraud</h2>
        <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {[
            "Never share OTP, UPI PIN, ATM PIN or passwords — no real officer asks for them.",
            "You never need to pay money to “release” a subsidy, loan or cooperative payment.",
            "Scanning a QR code or entering a UPI PIN sends money; it never receives it.",
            "Report cyber fraud immediately: call 1930 or visit cybercrime.gov.in.",
          ].map((t) => <li key={t} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">{t}</li>)}
        </ul>
      </section>
    </div>
  );
}
