import "server-only";
import { z } from "zod";
import { STATUSES } from "@/lib/shared";

const s = (max: number) => z.string().trim().max(max);

export const GrievanceFields = z.object({
  description: s(4000).min(8),
  category: s(60).min(1),
  subcategory: s(120).min(1),
  cooperative: s(160).min(2),
  coop_type: s(60).default(""),
  district: s(80).min(2),
  state: s(60).min(2),
  when_text: s(120).min(1),
  amount: s(40).default(""),
  member_name: s(120).default(""),
  language: z.enum(["hi", "bn", "en"]),
  required_documents: z.array(s(160)).max(8).default([]),
});

export const StatusSchema = z.enum(STATUSES as [string, ...string[]]);
