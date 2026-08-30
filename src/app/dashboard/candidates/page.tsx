import { auth } from "@/auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { CandidatesClient } from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const candidates = await prisma.candidateProfile.findMany({
    include: {
      user: true,
      assignments: {
        include: { area: true }
      }
    },
    orderBy: { user: { name: "asc" } }
  });

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Candidates Management</h1>
          <p className="text-slate-400 mt-1">
            Overview and status of all 7 prospective second-year leadership candidates.
          </p>
        </div>

        <CandidatesClient candidates={candidates} />
      </div>
    </AdminLayout>
  );
}
