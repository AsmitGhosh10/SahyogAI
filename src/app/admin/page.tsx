import type { Metadata } from "next";
import { isAdmin } from "@/lib/server/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Authority dashboard — SahyogAI" };

export default async function AdminPage() {
  return (await isAdmin()) ? <AdminDashboard /> : <AdminLogin />;
}
