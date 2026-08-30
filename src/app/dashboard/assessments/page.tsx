import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AssessmentsQueueClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const assessments = await prisma.assessment.findMany({
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true, questions: true } },
      evaluation: { include: { scores: true, admin: true } },
      responses: true,
    },
    orderBy: [{ status: "asc" }, { startedAt: "desc" }],
  });

  return (
    <AdminLayout>
      <AssessmentsQueueClient assessments={assessments} />
    </AdminLayout>
  );
}
