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
          user: true,
          assignments: { include: { area: true } },
          assessments: {
            include: {
              caseStudy: { include: { area: true } },
              evaluation: true,
            },
          },
        },
      },
    },
    orderBy: { roleName: "asc" },
  });

  let csv = "Role,Candidate Name,SEC ID,Department,Year,Assigned Capability Areas,Assessment Scores,Finalized At\n";

  finalAllocations.forEach((fa) => {
    const cand = fa.candidate;
    const name = `"${cand.user.name || ""}"`;
    const secId = cand.secId;
    const dept = `"${cand.department}"`;
    const year = `"${cand.year}"`;
    const areas = `"${cand.assignments.map((a) => a.area.name).join("; ")}"`;
    const scores = `"${cand.assessments
      .map((ass) => `${ass.caseStudy.area.name}: ${ass.evaluation?.totalScore?.toFixed(1) || "Pending"}`)
      .join("; ")}"`;
    const finalized = fa.allocatedAt ? new Date(fa.allocatedAt).toISOString() : "";

    csv += `"${fa.roleName}",${name},${secId},${dept},${year},${areas},${scores},"${finalized}"\n`;
  });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="MAGIC_Final_Roster_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
