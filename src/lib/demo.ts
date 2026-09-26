// Demo engine for the prototype UI. Keyword intent detection + canned, source-labelled answers.
// ponytail: keyword matching stands in for the FastAPI /api/chat + legal RAG backend; swap `answer()` for a fetch when it exists.

export type Lang = "en" | "hi" | "bn";
export type Evidence = "strong" | "limited" | "insufficient";
export type Status = "Submitted" | "Under Review" | "Info Requested" | "Forwarded" | "Resolved";

export const STATUSES: Status[] = ["Submitted", "Under Review", "Info Requested", "Forwarded", "Resolved"];
export const LANGS: { id: Lang; label: string; speech: string }[] = [
  { id: "hi", label: "हिंदी", speech: "hi-IN" },
  { id: "bn", label: "বাংলা", speech: "bn-IN" },
  { id: "en", label: "English", speech: "en-IN" },
];
export const STATES = ["Jharkhand", "West Bengal", "Bihar", "Odisha", "Uttar Pradesh", "Multi-State"];
export const COOP_TYPES = ["PACS", "Dairy Cooperative", "Credit Society", "Housing Society", "Multi-State Cooperative"];

type Intent = "voting" | "membership" | "deposit" | "loan" | "fraud" | "interest" | "unknown";

const KEYWORDS: Record<Exclude<Intent, "unknown">, string[]> = {
  fraud: ["otp", "upi pin", "atm pin", "password", "pin", "ओटीपी", "পিন"],
  voting: ["vote", "voting", "election", "वोट", "मतदान", "चुनाव", "ভোট", "নির্বাচন"],
  deposit: ["deposit", "refund", "not returned", "जमा", "वापस", "আমানত", "জমা", "ফেরত"],
  interest: ["interest", "ब्याज", "সুদ", "%"],
  loan: ["loan", "repay", "kcc", "ऋण", "लोन", "কর্জ", "ঋণ", "লোন"],
  membership: ["member", "membership", "right", "सदस्य", "अधिकार", "সদস্য", "অধিকার"],
};

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  for (const [intent, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return intent as Intent;
  }
  return "unknown";
}

export function detectLang(text: string): Lang {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  return "en";
}

export type Answer = {
  intent: string;
  topic: string;
  evidence: Evidence;
  text: string;
  steps: string[];
  source?: { doc: string; section: string; jurisdiction: string; applies: string; verified: string };
  offerGrievance?: boolean;
  warning?: boolean;
};

type Copy = { topic: string; text: string; steps: string[] };
const T: Record<Exclude<Intent, "unknown">, Record<Lang, Copy>> = {
  voting: {
    en: { topic: "Voting rights", text: "In most cooperatives, a registered member who meets the conditions in the society's by-laws (for example, holding the minimum share and not being in default) can vote in the general body election.", steps: ["Check your membership record and share certificate.", "Ask the society for the voter list and the by-law on eligibility.", "If you were left out without reason, you can raise a grievance."] },
    hi: { topic: "मतदान अधिकार", text: "अधिकतर सहकारी समितियों में, पंजीकृत सदस्य जो उपनियमों की शर्तें पूरी करता है (जैसे न्यूनतम शेयर और कोई बकाया नहीं), आम सभा चुनाव में वोट दे सकता है।", steps: ["अपनी सदस्यता और शेयर प्रमाणपत्र देखें।", "समिति से मतदाता सूची और पात्रता वाला उपनियम मांगें।", "बिना कारण नाम हटाया गया हो तो शिकायत दर्ज करें।"] },
    bn: { topic: "ভোটাধিকার", text: "বেশিরভাগ সমবায়ে, নিবন্ধিত সদস্য যিনি উপবিধির শর্ত পূরণ করেন (যেমন ন্যূনতম শেয়ার ও কোনো বকেয়া নেই), সাধারণ সভার নির্বাচনে ভোট দিতে পারেন।", steps: ["আপনার সদস্যপদ ও শেয়ার সার্টিফিকেট দেখুন।", "সমিতির কাছে ভোটার তালিকা ও যোগ্যতার উপবিধি চান।", "কারণ ছাড়া বাদ দেওয়া হলে অভিযোগ জানান।"] },
  },
  membership: {
    en: { topic: "Member rights", text: "Members generally have the right to attend the general body meeting, vote, inspect key records such as by-laws and audited accounts, and receive the services of the society on equal terms.", steps: ["Keep your passbook, share certificate and receipts safe.", "Ask for documents in writing and keep a copy.", "If information is denied, note the date and raise a grievance."] },
    hi: { topic: "सदस्य के अधिकार", text: "सदस्यों को आम तौर पर आम सभा में भाग लेने, वोट देने, उपनियम और ऑडिट खाते देखने और समिति की सेवाएँ बराबरी से पाने का अधिकार होता है।", steps: ["पासबुक, शेयर प्रमाणपत्र और रसीदें सुरक्षित रखें।", "दस्तावेज़ लिखित में मांगें और कॉपी रखें।", "जानकारी न मिले तो तारीख लिखें और शिकायत करें।"] },
    bn: { topic: "সদস্যের অধিকার", text: "সদস্যদের সাধারণত সাধারণ সভায় যোগ দেওয়া, ভোট দেওয়া, উপবিধি ও অডিট হিসাব দেখা এবং সমান শর্তে সমিতির পরিষেবা পাওয়ার অধিকার থাকে।", steps: ["পাসবই, শেয়ার সার্টিফিকেট ও রসিদ সংরক্ষণ করুন।", "লিখিতভাবে নথি চান ও কপি রাখুন।", "তথ্য না দিলে তারিখ লিখে অভিযোগ জানান।"] },
  },
  deposit: {
    en: { topic: "Deposit not returned", text: "A matured deposit should be repaid as per the deposit terms and the society's by-laws. If it is not, you can first ask the society in writing, then escalate to the Registrar of Cooperative Societies.", steps: ["Collect your deposit receipt and passbook.", "Write to the society secretary and keep a dated copy.", "Create a structured grievance here to track it."] },
    hi: { topic: "जमा राशि वापस नहीं", text: "परिपक्व जमा राशि जमा शर्तों और उपनियमों के अनुसार लौटाई जानी चाहिए। न मिले तो पहले समिति को लिखित में दें, फिर सहकारी समितियों के रजिस्ट्रार तक जाएँ।", steps: ["जमा रसीद और पासबुक इकट्ठा करें।", "समिति सचिव को पत्र लिखें और तारीख वाली कॉपी रखें।", "यहाँ शिकायत बनाकर उसे ट्रैक करें।"] },
    bn: { topic: "আমানত ফেরত দেয়নি", text: "মেয়াদপূর্ণ আমানত শর্ত ও উপবিধি অনুযায়ী ফেরত দেওয়া উচিত। না দিলে প্রথমে সমিতিকে লিখিতভাবে জানান, তারপর সমবায় নিবন্ধকের কাছে যান।", steps: ["আমানতের রসিদ ও পাসবই সংগ্রহ করুন।", "সমিতির সম্পাদককে চিঠি দিন ও তারিখসহ কপি রাখুন।", "এখানে অভিযোগ তৈরি করে ট্র্যাক করুন।"] },
  },
  loan: {
    en: { topic: "PACS loan", text: "PACS loans usually need membership, land or crop details, identity proof and a bank account. Repayment follows the schedule in your loan sanction letter.", steps: ["Ask the PACS for the written list of required documents.", "Check your sanction letter for due dates.", "Repay only at the PACS counter or official bank channel."] },
    hi: { topic: "पैक्स ऋण", text: "पैक्स ऋण के लिए आम तौर पर सदस्यता, ज़मीन/फसल विवरण, पहचान पत्र और बैंक खाता चाहिए। चुकौती आपके स्वीकृति पत्र की अनुसूची के अनुसार होती है।", steps: ["पैक्स से ज़रूरी दस्तावेज़ों की लिखित सूची मांगें।", "स्वीकृति पत्र में देय तिथियाँ देखें।", "भुगतान केवल पैक्स काउंटर या आधिकारिक बैंक से करें।"] },
    bn: { topic: "প্যাক্স ঋণ", text: "প্যাক্স ঋণের জন্য সাধারণত সদস্যপদ, জমি বা ফসলের তথ্য, পরিচয়পত্র ও ব্যাংক অ্যাকাউন্ট লাগে। পরিশোধ অনুমোদন পত্রের সূচি অনুযায়ী হয়।", steps: ["প্যাক্সের কাছে প্রয়োজনীয় নথির লিখিত তালিকা চান।", "অনুমোদন পত্রে কিস্তির তারিখ দেখুন।", "শুধু প্যাক্স কাউন্টার বা সরকারি ব্যাংকে টাকা দিন।"] },
  },
  interest: {
    en: { topic: "Understanding interest", text: "Simple example: ₹50,000 at 10% per year simple interest costs ₹5,000 in interest for one year, so you repay ₹55,000. Compound interest and fees can change this — always check your loan papers.", steps: ["Ask whether interest is simple or compound.", "Ask for all fees in writing.", "Use the total repayment amount to compare options."] },
    hi: { topic: "ब्याज समझें", text: "उदाहरण: ₹50,000 पर 10% सालाना साधारण ब्याज एक साल में ₹5,000 होता है, यानी कुल ₹55,000 चुकाने होंगे। चक्रवृद्धि ब्याज और शुल्क से राशि बदल सकती है — ऋण के कागज़ ज़रूर देखें।", steps: ["पूछें ब्याज साधारण है या चक्रवृद्धि।", "सभी शुल्क लिखित में मांगें।", "कुल चुकौती राशि से विकल्पों की तुलना करें।"] },
    bn: { topic: "সুদ বোঝা", text: "উদাহরণ: ₹৫০,০০০ টাকায় বছরে ১০% সরল সুদ মানে এক বছরে ₹৫,০০০ সুদ, মোট ₹৫৫,০০০ ফেরত দিতে হবে। চক্রবৃদ্ধি সুদ ও চার্জে পরিমাণ বদলাতে পারে — ঋণের কাগজ দেখে নিন।", steps: ["সুদ সরল না চক্রবৃদ্ধি জিজ্ঞাসা করুন।", "সব চার্জ লিখিতভাবে চান।", "মোট পরিশোধের অঙ্ক দিয়ে তুলনা করুন।"] },
  },
  fraud: {
    en: { topic: "Safety warning", text: "Do not share your OTP, UPI PIN, ATM PIN or password with anyone — not even someone claiming to be from your cooperative or bank. No genuine official will ask for them.", steps: ["Do not make the requested payment.", "Verify the request at the PACS office or official helpline.", "Report cyber fraud at 1930 or cybercrime.gov.in."] },
    hi: { topic: "सुरक्षा चेतावनी", text: "अपना OTP, UPI PIN, ATM PIN या पासवर्ड किसी को न बताएँ — चाहे वह समिति या बैंक से होने का दावा करे। कोई असली अधिकारी यह नहीं माँगता।", steps: ["माँगा गया भुगतान न करें।", "पैक्स कार्यालय या आधिकारिक हेल्पलाइन से पुष्टि करें।", "साइबर धोखाधड़ी की सूचना 1930 या cybercrime.gov.in पर दें।"] },
    bn: { topic: "নিরাপত্তা সতর্কতা", text: "আপনার OTP, UPI PIN, ATM PIN বা পাসওয়ার্ড কাউকে দেবেন না — সমিতি বা ব্যাংকের লোক বললেও না। কোনো আসল কর্মকর্তা এগুলো চান না।", steps: ["চাওয়া টাকা দেবেন না।", "প্যাক্স অফিস বা সরকারি হেল্পলাইনে যাচাই করুন।", "সাইবার প্রতারণা 1930 বা cybercrime.gov.in-এ জানান।"] },
  },
};

const UNKNOWN: Record<Lang, string> = {
  en: "I could not find sufficient information in the available verified sources to answer this reliably. Could you tell me your state, cooperative type, or share the document?",
  hi: "उपलब्ध सत्यापित स्रोतों में इसका भरोसेमंद उत्तर देने लायक पर्याप्त जानकारी नहीं मिली। क्या आप अपना राज्य, समिति का प्रकार बता सकते हैं या दस्तावेज़ साझा कर सकते हैं?",
  bn: "যাচাইকৃত উৎসে এর নির্ভরযোগ্য উত্তর দেওয়ার মতো যথেষ্ট তথ্য পাইনি। আপনার রাজ্য, সমবায়ের ধরন জানাবেন বা নথি দেবেন?",
};

export const ASK_STATE: Record<Lang, string> = {
  en: "Rules depend on your state and cooperative type. Select them above for a jurisdiction-matched answer.",
  hi: "नियम आपके राज्य और समिति के प्रकार पर निर्भर करते हैं। सटीक उत्तर के लिए ऊपर चुनें।",
  bn: "নিয়ম আপনার রাজ্য ও সমবায়ের ধরনের উপর নির্ভর করে। সঠিক উত্তরের জন্য উপরে বেছে নিন।",
};

const INTENT_LABEL: Record<Intent, string> = {
  voting: "Cooperative Governance",
  membership: "Cooperative Rights",
  deposit: "Grievance · Financial",
  loan: "PACS Services",
  interest: "Financial Literacy",
  fraud: "Fraud Awareness",
  unknown: "Unclear",
};

export function answer(message: string, lang: Lang, state: string, coop: string): Answer {
  const intent = detectIntent(message);
  if (intent === "unknown") {
    return { intent: INTENT_LABEL.unknown, topic: "—", evidence: "insufficient", text: UNKNOWN[lang], steps: [] };
  }
  const c = T[intent][lang];
  const legal = intent === "voting" || intent === "membership" || intent === "deposit" || intent === "loan";
  const jurisdictionKnown = Boolean(state && coop);
  return {
    intent: INTENT_LABEL[intent],
    topic: c.topic,
    // Legal answers are only "strong" once jurisdiction is pinned down (PRD §7, §10).
    evidence: !legal || jurisdictionKnown ? "strong" : "limited",
    text: c.text,
    steps: c.steps,
    warning: intent === "fraud",
    offerGrievance: intent === "voting" || intent === "deposit" || intent === "membership",
    source: legal
      ? {
          doc: jurisdictionKnown ? `${state} Cooperative Societies Act & Rules` : "State Cooperative Societies Act (state not set)",
          section: "Demo KB — provision reference shown once the verified corpus is loaded",
          jurisdiction: state === "Multi-State" ? "Central (Multi-State)" : state || "Not confirmed",
          applies: coop || "Not confirmed",
          verified: "Demo data",
        }
      : undefined,
  };
}

// ---------- Grievances (localStorage; demo only, never sent anywhere) ----------

export type Grievance = {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  cooperative: string;
  district: string;
  state: string;
  when: string;
  amount?: string;
  language: Lang;
  status: Status;
  createdAt: string;
  history: { status: Status; at: string; note?: string }[];
};

const KEY = "sahyog.grievances";

export function classify(text: string): { category: string; subcategory: string; amount?: string; evidence: string[] } {
  const intent = detectIntent(text);
  const amount = text.match(/₹\s?[\d,]+|rs\.?\s?[\d,]+|[\d,]{4,}/i)?.[0]?.replace(/rs\.?\s?/i, "₹");
  const map: Record<Intent, [string, string, string[]]> = {
    deposit: ["Financial", "Deposit repayment", ["Deposit receipt", "Passbook", "Written request to society"]],
    loan: ["Loan", "PACS loan / repayment", ["Loan sanction letter", "Repayment receipts"]],
    voting: ["Cooperative Governance", "Election / Voting", ["Membership details", "Share certificate", "Voter list copy"]],
    membership: ["Membership", "Member rights / information", ["Membership details", "Written request copy"]],
    interest: ["Financial", "Interest / charges dispute", ["Loan papers", "Account statement"]],
    fraud: ["Fraud", "Suspected fraud", ["Call/SMS screenshots", "Transaction reference"]],
    unknown: ["General", "Other", ["Any supporting document"]],
  };
  const [category, subcategory, evidence] = map[intent];
  return { category, subcategory, amount, evidence };
}

export function newId() {
  return `GRV-2026-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
}

export function loadGrievances(): Grievance[] {
  try {
    const own = JSON.parse(localStorage.getItem(KEY) || "[]") as Grievance[];
    return [...own, ...SEED.filter((s) => !own.some((o) => o.id === s.id))];
  } catch {
    return SEED;
  }
}

export function saveGrievance(g: Grievance) {
  try {
    const own = JSON.parse(localStorage.getItem(KEY) || "[]") as Grievance[];
    localStorage.setItem(KEY, JSON.stringify([g, ...own.filter((o) => o.id !== g.id)]));
  } catch {
    /* private mode: demo keeps working, just without persistence */
  }
}

const d = (days: number) => new Date(Date.now() - days * 864e5).toISOString();
const seed = (id: string, category: string, subcategory: string, description: string, cooperative: string, district: string, state: string, language: Lang, status: Status, days: number, amount?: string): Grievance => ({
  id, category, subcategory, description, cooperative, district, state, when: `${days} days ago`, language, status, amount,
  createdAt: d(days),
  history: [{ status: "Submitted", at: d(days) }, ...(status !== "Submitted" ? [{ status, at: d(Math.max(0, days - 2)) }] : [])],
});

export const SEED: Grievance[] = [
  seed("GRV-2026-00421", "Financial", "Deposit repayment", "Meri cooperative ne mera ₹20,000 ka deposit return nahi kiya.", "ABC PACS", "Jamtara", "Jharkhand", "hi", "Under Review", 9, "₹20,000"),
  seed("GRV-2026-00418", "Cooperative Governance", "Election / Voting", "আমার সমবায় সমিতি আমাকে ভোট দিতে দিচ্ছে না।", "Uttar Dinajpur Dairy Coop", "Uttar Dinajpur", "West Bengal", "bn", "Submitted", 3),
  seed("GRV-2026-00407", "Loan", "PACS loan / repayment", "Loan repayment entered twice in my passbook.", "Dumka Krishak PACS", "Dumka", "Jharkhand", "en", "Info Requested", 14, "₹12,500"),
  seed("GRV-2026-00396", "Membership", "Member rights / information", "Society refused to show audited accounts at the AGM.", "Gaya Credit Society", "Gaya", "Bihar", "hi", "Forwarded", 21),
  seed("GRV-2026-00380", "Financial", "Interest / charges dispute", "Extra processing fee charged on KCC renewal.", "Cuttack PACS", "Cuttack", "Odisha", "en", "Resolved", 33, "₹1,800"),
];
