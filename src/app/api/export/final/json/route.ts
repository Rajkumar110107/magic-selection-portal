import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const finalAllocations = await prisma.finalAllocation.findMany({
    include: {
      candidate: {
        include: {
          user: { select: { name: true, email: true } },
          assignments: { include: { area: true } },
          assessments: {
            include: {
              caseStudy: { include: { area: true } },
              evaluation: { include: { scores: true } },
              responses: true,
            },
          },
          teamObservations: {
            include: {
              observation: { include: { area: true } },
            },
          },
        },
      },
    },
    orderBy: { roleName: "asc" },
  });

  const exportData = {
    portal: "MAGIC Selection Portal",
    generatedAt: new Date().toISOString(),
    totalAllocations: finalAllocations.length,
    roster: finalAllocations.map((fa) => ({
      finalRole: fa.roleName,
      isLocked: fa.isLocked,
      allocatedAt: fa.allocatedAt,
      candidate: {
        name: fa.candidate.user.name,
        email: fa.candidate.user.email,
        secId: fa.candidate.secId,
        department: fa.candidate.department,
        year: fa.candidate.year,
        assignedAreas: fa.candidate.assignments.map((a) => a.area.name),
        assessments: fa.candidate.assessments.map((ass) => ({
          area: ass.caseStudy.area.name,
          caseStudy: ass.caseStudy.title,
          status: ass.status,
          totalScore: ass.evaluation?.totalScore || null,
          scores: ass.evaluation?.scores || [],
          evaluatorNotes: ass.evaluation?.notes || null,
        })),
      },
    })),
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="MAGIC_Full_Selection_Report_${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
