"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveEvaluation(
  assessmentId: string,
  scores: { dimension: string; score: number }[],
  notes: string,
  isFinal: boolean
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only administrators can record evaluations.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true } },
      evaluation: { include: { scores: true } }
    }
  });

  if (!assessment) {
    throw new Error("Assessment not found.");
  }

  // Calculate average total score across provided dimensions
  const validScores = scores.filter((s) => typeof s.score === "number" && s.score >= 1 && s.score <= 10);
  const totalScore = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length
    : 5;

  let evaluationId: string;

  if (assessment.evaluation) {
    // Update existing evaluation
    const updated = await prisma.evaluation.update({
      where: { id: assessment.evaluation.id },
      data: {
        notes,
        totalScore,
        adminId: session.user.id,
        evaluatedAt: new Date()
      }
    });
    evaluationId = updated.id;

    // Replace evaluation scores
    await prisma.evaluationScore.deleteMany({
      where: { evaluationId: updated.id }
    });

    await prisma.evaluationScore.createMany({
      data: validScores.map((s) => ({
        evaluationId: updated.id,
        dimension: s.dimension,
        score: s.score
      }))
    });
  } else {
    // Create new evaluation
    const created = await prisma.evaluation.create({
      data: {
        assessmentId,
        adminId: session.user.id,
        notes,
        totalScore,
        scores: {
          create: validScores.map((s) => ({
            dimension: s.dimension,
            score: s.score
          }))
        }
      }
    });
    evaluationId = created.id;
  }

  if (isFinal) {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: "EVALUATED" }
    });
  }

  // Record audit log entry
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: isFinal ? "EVALUATION_FINALIZED" : "EVALUATION_SAVED_DRAFT",
      details: JSON.stringify({
        assessmentId,
        evaluationId,
        candidateName: assessment.candidate.user.name,
        candidateSecId: assessment.candidate.secId,
        capabilityArea: assessment.caseStudy.area.name,
        totalScore,
        isFinal,
        evaluatedBy: session.user.email
      })
    }
  });

  revalidatePath(`/dashboard/assessments/${assessmentId}`);
  revalidatePath(`/dashboard/assessments`);
  revalidatePath(`/dashboard/evaluations`);
  return { success: true, totalScore };
}
