import Link from "next/link";
import { Menu } from "lucide-react";
import Logo from "./Logo";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#kiosk", label: "Kiosk" },
  { href: "/grievance", label: "Grievance" },
  { href: "/admin", label: "Authority" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="SahyogAI home">
          <Logo />
          <span className="text-lg tracking-tight">
            Sahyog<span className="text-leaf">AI</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/assistant"
            className="rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-dark"
          >
            Try assistant
          </Link>
          <details className="relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line bg-white" aria-label="Open menu">
              <Menu size={18} />
            </summary>
            <ul className="absolute right-0 mt-2 w-48 rounded-2xl border border-line bg-white p-2 shadow-lg">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-sand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
