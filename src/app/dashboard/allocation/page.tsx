import { auth } from "@/auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { AllocationClient } from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AllocationPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const candidates = await prisma.candidateProfile.findMany({
    include: {
      user: true,
      assignments: {
        include: { area: true }
      }
    },
    orderBy: { user: { name: 'asc' } }
  });

  const areas = await prisma.capabilityArea.findMany({
    include: {
      assignments: {
        include: {
          candidate: { include: { user: true } }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const observations = await prisma.teamObservation.findMany({
    include: {
      area: true,
      participants: {
        include: {
          candidate: { include: { user: true } }
        }
      },
      admin: true
    },
    orderBy: { observedAt: 'desc' }
  });

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Capability Area Allocation</h1>
              <p className="text-slate-400 mt-1">
                Record candidates&apos; physical selection meeting choices and manage capability area locking (1–2 areas per candidate, max 2 candidates per area).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Matrix, Overlap Discussions & Lock Management */}
        <AllocationClient candidates={candidates} areas={areas} observations={observations} />

      </div>
    </AdminLayout>
  );
}
