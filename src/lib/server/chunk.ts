// Pure text helpers for the knowledge base (no DB), so they can be unit-tested directly.

// Lines that open a statutory section / rule / bye-law clause, e.g. "12. Voting rights", "12A.", "Rule 5", "Section 7".
const SECTION_RE = /^\s*((?:section|rule|bye-?law|article|chapter|clause)\s+[\dIVXL]+[A-Z]?|\d{1,3}[A-Z]?\.)\s*(.{0,90})/i;
const MAX = 1400;

export function chunkPages(pages: string[]) {
  const out: { content: string; section: string; page: number }[] = [];
  let section = "";
  let buf = "";
  let bufPage = 1;
  const flush = () => {
    const t = buf.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    if (t.length > 40) out.push({ content: t, section, page: bufPage });
    buf = "";
  };
  pages.forEach((text, i) => {
    for (const para of text.split(/\n\s*\n|(?=\n\s*(?:section|rule|\d{1,3}[A-Z]?\.)\s)/i)) {
      const m = para.match(SECTION_RE);
      if (m) {
        flush();
        // Keep only the heading ("12. Voting rights of members"), not the provision text after ".—" / ".-".
        section = `${m[1]} ${m[2].split(/\.?\s*[—–]|\.-|\.\s|:/)[0]}`.trim();
      }
      if (!buf) bufPage = i + 1;
      if (buf.length + para.length > MAX) flush();
      if (!buf) bufPage = i + 1;
      buf += para + "\n\n";
    }
  });
  flush();
  return out;
}

/** Turn free-form search terms into a safe FTS5 OR-query of quoted tokens. */
export function ftsQuery(terms: string[]) {
  const words = new Set<string>();
  for (const t of terms) for (const w of t.toLowerCase().split(/[^\p{L}\p{M}\p{N}]+/u)) if (w.length > 2) words.add(w);
  return [...words].slice(0, 24).map((w) => `"${w}"`).join(" OR ");
}

