import { auth } from "@/auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CandidateProfileClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const candidate = await prisma.candidateProfile.findUnique({
    where: { id },
    include: {
      user: true,
      assignments: {
        include: { area: true }
      },
      assessments: {
        include: { caseStudy: true }
      }
    }
  });

  if (!candidate) notFound();

  const allAreas = await prisma.capabilityArea.findMany({
    include: { assignments: true },
    orderBy: { name: "asc" }
  });

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      details: {
        contains: candidate.id
      }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <AdminLayout>
      <CandidateProfileClient
        candidate={candidate}
        allAreas={allAreas}
        auditLogs={auditLogs}
      />
    </AdminLayout>
  );
}
