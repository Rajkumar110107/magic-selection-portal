"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Saves or updates a candidate's response to a specific question.
 * Guaranteed idempotent and protected by candidate ownership and submission immutability checks.
 */
export async function saveResponse(assessmentId: string, questionId: string, answerText: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Session expired or invalid.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { candidate: true }
  });

  if (!assessment) {
    throw new Error("Assessment record not found.");
  }

  // Security guard: Only the assigned candidate (or an admin) can save responses
  if (session.user.role === "CANDIDATE" && assessment.candidate.userId !== session.user.id) {
    throw new Error("Forbidden: You cannot modify another candidate's assessment.");
  }

  // Data integrity guard: Submitted/Evaluated assessments are strictly immutable
  if (assessment.status === "COMPLETED" || assessment.status === "EVALUATED" || assessment.status === "SUBMITTED") {
    throw new Error("Immutable: This assessment has already been finalized and submitted.");
  }

  // Verify the question belongs to this assessment's case study
  const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question || question.caseStudyId !== assessment.caseStudyId) {
    throw new Error("Invalid question for this case study.");
  }

  // Upsert the response record
  const saved = await prisma.response.upsert({
    where: {
      assessmentId_questionId: {
        assessmentId,
        questionId
      }
    },
    update: {
      answerText: answerText.trim(),
      submittedAt: new Date()
    },
    create: {
      assessmentId,
      questionId,
      answerText: answerText.trim(),
      submittedAt: new Date()
    }
  });

  return {
    success: true,
    savedAt: saved.submittedAt.toISOString()
  };
}

/**
 * Finalizes and permanently submits the candidate assessment.
 * Locks responses from any future modifications.
 */
export async function submitAssessment(assessmentId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Session expired or invalid.");
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true, questions: true } },
      responses: true
    }
  });

  if (!assessment) {
    throw new Error("Assessment record not found.");
  }

  if (session.user.role === "CANDIDATE" && assessment.candidate.userId !== session.user.id) {
    throw new Error("Forbidden: You cannot submit another candidate's assessment.");
  }

  if (assessment.status === "COMPLETED" || assessment.status === "EVALUATED" || assessment.status === "SUBMITTED") {
    return { success: true, message: "Assessment was already submitted." };
  }

  const now = new Date();

  // Update assessment status to COMPLETED
  await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      status: "COMPLETED",
      completedAt: now
    }
  });

  // Create audit log for submission
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ASSESSMENT_SUBMITTED",
      details: JSON.stringify({
        assessmentId,
        candidateProfileId: assessment.candidateProfileId,
        candidateName: assessment.candidate.user.name,
        candidateSecId: assessment.candidate.secId,
        caseStudyCode: assessment.caseStudy.code,
        caseStudyTitle: assessment.caseStudy.title,
        capabilityArea: assessment.caseStudy.area.name,
        answeredCount: assessment.responses.length,
        totalQuestions: assessment.caseStudy.questions.length,
        submittedAt: now.toISOString()
      })
    }
  });

  return {
    success: true,
    completedAt: now.toISOString()
  };
}
