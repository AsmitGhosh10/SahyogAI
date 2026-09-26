import type { Metadata } from "next";

export const metadata: Metadata = { title: "Loan \& deposit calculator — SahyogAI" };

export default function Layout({ children }: LayoutProps<"/finance">) {
  return children;
}
