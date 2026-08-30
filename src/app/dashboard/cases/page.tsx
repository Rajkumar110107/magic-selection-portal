import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CaseStudiesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const capabilityAreas = await prisma.capabilityArea.findMany({
    include: {
      caseStudies: {
        include: {
          questions: {
            orderBy: { orderNumber: "asc" }
          },
          assessments: {
            include: {
              candidate: {
                include: { user: true }
              }
            }
          }
        },
        orderBy: { code: "asc" }
      }
    },
    orderBy: { name: "asc" }
  });

  const totalCases = capabilityAreas.reduce((acc, area) => acc + area.caseStudies.length, 0);
  const totalQuestions = capabilityAreas.reduce(
    (acc, area) =>
      acc + area.caseStudies.reduce((qAcc, cs) => qAcc + cs.questions.length, 0),
    0
  );
  const totalAssignments = capabilityAreas.reduce(
    (acc, area) =>
      acc + area.caseStudies.reduce((aAcc, cs) => aAcc + cs.assessments.length, 0),
    0
  );

  return (
    <AdminLayout>
      <CaseStudiesClient
        capabilityAreas={capabilityAreas}
        totalCases={totalCases}
        totalQuestions={totalQuestions}
        totalAssignments={totalAssignments}
      />
    </AdminLayout>
  );
}
