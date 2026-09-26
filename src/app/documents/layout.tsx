import type { Metadata } from "next";

export const metadata: Metadata = { title: "Understand a document — SahyogAI" };

export default function Layout({ children }: LayoutProps<"/documents">) {
  return children;
}
