import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { CandidateDashboard } from "@/components/candidate/candidate-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    return <AdminDashboard userId={session.user.id} />;
  }

  return <CandidateDashboard userId={session.user.id} />;
}
