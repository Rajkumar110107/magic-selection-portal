import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { AssessmentClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      candidate: { include: { user: true } },
      caseStudy: {
        include: {
          area: true,
          questions: { orderBy: { orderNumber: 'asc' } }
        }
      },
      responses: true
    }
  });

  if (!assessment) return notFound();

  // Only the assigned candidate or an ADMIN can view this page
  if (session.user.role === "CANDIDATE") {
    if (assessment.candidate.userId !== session.user.id) {
      redirect("/dashboard");
    }
  }

  const isCandidate = session.user.role === "CANDIDATE";
  const isCompleted =
    assessment.status === "COMPLETED" ||
    assessment.status === "EVALUATED" ||
    assessment.status === "SUBMITTED";

  // Calculate current unlocked question threshold based on saved responses
  const answeredQuestionIds = new Set(
    assessment.responses
      .filter((r) => r.answerText && r.answerText.trim().length > 0)
      .map((r) => r.questionId)
  );

  let highestAnsweredIndex = -1;
  assessment.caseStudy.questions.forEach((q, idx) => {
    if (answeredQuestionIds.has(q.id)) {
      highestAnsweredIndex = Math.max(highestAnsweredIndex, idx);
    }
  });

  const unlockedIndex = isCompleted
    ? assessment.caseStudy.questions.length - 1
    : Math.max(0, highestAnsweredIndex + 1);

  const sanitizedQuestions = assessment.caseStudy.questions.map((q, idx) => {
    if (isCandidate) {
      return {
        id: q.id,
        orderNumber: q.orderNumber,
        questionText: q.questionText,
        // Only reveal twist / newInformation if the candidate has reached this question
        newInformation: idx <= unlockedIndex ? q.newInformation : null,
        // Never expose evaluator criteria to candidates
        competencyTested: null,
      };
    }
    return q;
  });

  const sanitizedCaseStudy = {
    ...assessment.caseStudy,
    hiddenDetails: isCandidate ? null : assessment.caseStudy.hiddenDetails,
    questions: sanitizedQuestions,
  };

  const safeAssessment = {
    ...assessment,
    caseStudy: sanitizedCaseStudy,
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-slate-100 flex flex-col">
      <header className="bg-[#0a0f1e] border-b border-slate-800 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              MAGIC SELECTION
            </h1>
            <p className="text-xs text-slate-400 mt-1">Assessment Session</p>
          </div>
          {session.user.role === "ADMIN" && (
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-medium border border-red-500/20">
              Admin View Mode
            </span>
          )}
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <AssessmentClient assessment={safeAssessment as any} isAdmin={session.user.role === "ADMIN"} />
      </main>
    </div>
  );
}
