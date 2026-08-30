import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FinalAllocationClient } from "./client";

export const dynamic = "force-dynamic";

export default async function FinalSelectionPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const candidates = await prisma.candidateProfile.findMany({
    include: {
      user: true,
      assignments: {
        include: { area: true },
      },
      assessments: {
        include: {
          caseStudy: { include: { area: true, questions: true } },
          evaluation: { include: { scores: true, admin: true } },
          responses: true,
        },
      },
      teamObservations: {
        include: {
          observation: { include: { area: true } },
        },
      },
      finalAllocations: true,
    },
    orderBy: { user: { name: "asc" } },
  });

  const finalAllocations = await prisma.finalAllocation.findMany({
    include: {
      candidate: { include: { user: true } },
    },
  });

  const capabilityAreas = await prisma.capabilityArea.findMany();

  return (
    <AdminLayout>
      <FinalAllocationClient
        candidates={candidates}
        existingAllocations={finalAllocations}
        capabilityAreas={capabilityAreas}
      />
    </AdminLayout>
  );
}
