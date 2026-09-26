import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Logo size={28} /> SahyogAI
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Multilingual cooperative governance, legal assistance and grievance platform. Smart India Hackathon 2026 ·
            Problem Statement 26088 · Ministry of Cooperation (NCCT).
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/assistant" className="hover:text-ink">Assistant</Link></li>
            <li><Link href="/grievance" className="hover:text-ink">File / track grievance</Link></li>
            <li><Link href="/admin" className="hover:text-ink">Authority dashboard</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Important</p>
          <p className="mt-3 text-muted">
            Prototype. Provides information, not legal or financial advice. Grievances are stored locally in this demo
            and are not sent to any government system.
          </p>
        </div>
      </div>
    </footer>
  );
}
