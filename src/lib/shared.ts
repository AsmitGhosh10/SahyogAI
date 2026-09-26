// Constants and API types shared by client pages and server routes.

export type Lang = "en" | "hi" | "bn";
export type Evidence = "strong" | "limited" | "insufficient";
export type Status = "Submitted" | "Under Review" | "Info Requested" | "Forwarded" | "Resolved";

export const STATUSES: Status[] = ["Submitted", "Under Review", "Info Requested", "Forwarded", "Resolved"];
export const LANGS: { id: Lang; label: string; name: string; speech: string }[] = [
  { id: "hi", label: "हिंदी", name: "Hindi", speech: "hi-IN" },
  { id: "bn", label: "বাংলা", name: "Bengali", speech: "bn-IN" },
  { id: "en", label: "English", name: "English", speech: "en-IN" },
];
export const langName = (l: Lang) => LANGS.find((x) => x.id === l)!.name;
export const speechLang = (l: Lang) => LANGS.find((x) => x.id === l)!.speech;

export const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
export const COOP_TYPES = ["PACS", "Dairy Cooperative", "Credit Society", "Housing Society", "Fisheries Cooperative", "Multi-State Cooperative"];
export const CATEGORIES = ["Financial", "Loan", "Membership", "Cooperative Governance", "Election", "Fraud", "Services", "Other"];

export type Source = {
  title: string;
  authority: string;
  section: string;
  page: number;
  jurisdiction: string;
  applies_to: string;
  source_url: string;
  last_verified: string;
  excerpt: string;
};

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type ChatResponse = {
  mode: "ai" | "demo";
  /** legal = law/rules/by-laws question, graded by evidence; general = education/safety guidance. */
  kind: "legal" | "general";
  language: Lang;
  intent: string;
  topic: string;
  answer: string;
  steps: string[];
  evidence: Evidence;
  sources: Source[];
  clarifying_question: string | null;
  offer_grievance: boolean;
  safety_warning: boolean;
  jurisdiction: string;
};

export type GrievanceAnalysis = {
  mode: "ai" | "demo";
  category: string;
  subcategory: string;
  amount: string;
  cooperative: string;
  district: string;
  state: string;
  when: string;
  summary: string;
  priority: "normal" | "high";
  required_documents: string[];
  missing_questions: string[];
};

export type GrievanceEvent = { status: Status; note: string; actor: string; at: string };

/** Public view — what a member sees when tracking by ID. */
export type GrievancePublic = {
  id: string;
  category: string;
  subcategory: string;
  cooperative: string;
  district: string;
  status: Status;
  created_at: string;
  events: GrievanceEvent[];
};

export type Grievance = GrievancePublic & {
  description: string;
  summary: string;
  coop_type: string;
  state: string;
  when_text: string;
  amount: string;
  member_name: string;
  language: Lang;
  priority: string;
  required_documents: string[];
  letter: string;
  updated_at: string;
};

export type DocumentAnalysis = {
  mode: "ai";
  document_type: string;
  language: string;
  key_points: string[];
  meaning: string;
  things_to_verify: string[];
  suggested_action: string;
  sources: Source[];
};
