import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ComparisonClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CandidateComparisonPage() {
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
          caseStudy: {
            include: {
              area: true,
              questions: { orderBy: { orderNumber: "asc" } },
            },
          },
          evaluation: {
            include: { scores: true, admin: true },
          },
          responses: true,
        },
      },
      teamObservations: {
        include: {
          observation: {
            include: { area: true, admin: true },
          },
        },
      },
    },
    orderBy: { user: { name: "asc" } },
  });

  const capabilityAreas = await prisma.capabilityArea.findMany({
    include: {
      assignments: {
        include: {
          candidate: { include: { user: true } },
        },
      },
      teamObservations: {
        include: {
          participants: {
            include: { candidate: { include: { user: true } } },
          },
          admin: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <AdminLayout>
      <ComparisonClient
        candidates={candidates}
        capabilityAreas={capabilityAreas}
      />
    </AdminLayout>
  );
}
