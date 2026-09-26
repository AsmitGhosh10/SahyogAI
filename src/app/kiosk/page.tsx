import type { Metadata } from "next";
import Assistant from "@/components/Assistant";

export const metadata: Metadata = { title: "Kiosk — SahyogAI" };

// Full-screen layer over the site chrome: large targets, answers are always spoken (Raspberry Pi kiosk, PRD §26).
export default function KioskPage() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-cream">
      <Assistant kiosk />
    </div>
  );
}
