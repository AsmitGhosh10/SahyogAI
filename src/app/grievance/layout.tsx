import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grievance — SahyogAI" };

export default function Layout({ children }: LayoutProps<"/grievance">) {
  return children;
}
