import "server-only";
import type { Lang } from "@/lib/shared";

export type LetterFacts = {
  description: string; category: string; subcategory: string; cooperative: string; district: string; state: string;
  when_text: string; amount: string; member_name: string; required_documents: string[];
};

/** Deterministic template used when AI drafting is unavailable. */
export function templateLetter(g: LetterFacts, lang: Lang) {
  const date = new Date().toLocaleDateString("en-IN");
  const amt = g.amount ? ` (${g.amount})` : "";
  const docs = g.required_documents.map((d, i) => `${i + 1}. ${d}`).join("\n") || "—";
  const name = g.member_name || "____________";
  if (lang === "hi")
    return `विषय: ${g.subcategory}${amt} के संबंध में शिकायत\n\nसेवा में,\nसचिव / प्रबंध समिति, ${g.cooperative}\nज़िला ${g.district}, ${g.state}\n\nमहोदय/महोदया,\n\nमैं ${g.cooperative} का/की सदस्य हूँ। मैं निम्नलिखित समस्या की सूचना देना चाहता/चाहती हूँ:\n\n${g.description}\n\nघटना का समय: ${g.when_text}\n\nअनुरोध: कृपया इस मामले की जाँच कर उचित कार्रवाई करें और मुझे लिखित में सूचित करें।\n\nसंलग्नक:\n${docs}\n\nदिनांक: ${date}\n\nभवदीय,\n${name}`;
  if (lang === "bn")
    return `বিষয়: ${g.subcategory}${amt} সংক্রান্ত অভিযোগ\n\nপ্রতি,\nসম্পাদক / পরিচালন সমিতি, ${g.cooperative}\nজেলা ${g.district}, ${g.state}\n\nমহাশয়/মহাশয়া,\n\nআমি ${g.cooperative}-এর একজন সদস্য। আমি নিম্নলিখিত সমস্যাটি জানাতে চাই:\n\n${g.description}\n\nঘটনার সময়: ${g.when_text}\n\nঅনুরোধ: অনুগ্রহ করে বিষয়টি তদন্ত করে যথাযথ ব্যবস্থা নিন এবং আমাকে লিখিতভাবে জানান।\n\nসংযুক্তি:\n${docs}\n\nতারিখ: ${date}\n\nবিনীত,\n${name}`;
  return `Subject: Grievance regarding ${g.subcategory.toLowerCase()}${amt}\n\nTo,\nThe Secretary / Managing Committee, ${g.cooperative}\nDistrict ${g.district}, ${g.state}\n\nRespected Sir/Madam,\n\nI am a member of ${g.cooperative}. I am reporting the following issue:\n\n${g.description}\n\nWhen it occurred: ${g.when_text}\n\nRequested action: Kindly look into this matter, take appropriate action and inform me in writing.\n\nAttachments:\n${docs}\n\nDate: ${date}\n\nYours faithfully,\n${name}`;
}
