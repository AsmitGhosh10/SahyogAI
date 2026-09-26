import type { Evidence } from "@/lib/demo";

const STYLE: Record<Evidence, { label: string; cls: string; dot: string }> = {
  strong: { label: "Strong evidence", cls: "bg-leaf-soft text-leaf-dark", dot: "bg-leaf" },
  limited: { label: "Limited evidence", cls: "bg-turmeric-soft text-[#8a520c]", dot: "bg-turmeric" },
  insufficient: { label: "Insufficient evidence", cls: "bg-brick-soft text-brick", dot: "bg-brick" },
};

export default function EvidenceBadge({ level }: { level: Evidence }) {
  const s = STYLE[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}
