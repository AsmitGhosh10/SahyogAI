// Run: npm test   (Node's built-in test runner + TypeScript stripping; no extra dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { emi, fdMaturity, simpleInterest } from "../src/lib/finance.ts";
import { chunkPages, ftsQuery } from "../src/lib/server/chunk.ts";

test("loan maths", () => {
  // ₹50,000 at 10% flat for 12 months → ₹5,000 interest (the PRD example).
  assert.equal(simpleInterest(50000, 10, 12).interest, 5000);
  // Reducing-balance EMI for the same loan is about ₹4,396/month.
  assert.equal(Math.round(emi(50000, 10, 12).monthly), 4396);
  assert.equal(emi(12000, 0, 12).monthly, 1000);
  // ₹10,000 FD at 8% for 12 months, quarterly compounding → ₹10,824.32.
  assert.equal(fdMaturity(10000, 8, 12).maturity.toFixed(2), "10824.32");
});

test("chunker keeps section headings and pages", () => {
  const pages = [
    "CHAPTER III\n\n12. Voting rights of members.—Every member shall have one vote in the affairs of the society.\n\n13. Manner of voting.—Voting shall be in person and proxies are not allowed in any meeting.",
    "25. Audit.—The accounts of every society shall be audited at least once in each year by an auditor.",
  ];
  const chunks = chunkPages(pages);
  const audit = chunks.find((c) => c.content.includes("audited"));
  assert.ok(chunks.some((c) => c.section === "12. Voting rights of members"));
  assert.equal(audit?.page, 2);
  assert.ok(audit?.section.startsWith("25."));
});

test("FTS query is quoted and injection-safe", () => {
  assert.equal(ftsQuery(['vote" OR x', "general body"]), '"vote" OR "general" OR "body"');
  assert.equal(ftsQuery(["मतदान अधिकार"]), '"मतदान" OR "अधिकार"');
  assert.equal(ftsQuery(["a", "of"]), "");
});
