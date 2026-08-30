import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return new Response("Unauthorized", { status: 401 });

  const { id } = await context.params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true, questions: { orderBy: { orderNumber: 'asc' } } } },
      responses: true,
      evaluation: { include: { scores: true } }
    }
  });

  if (!assessment) return new Response("Not found", { status: 404 });

  let text = `====================================================\n`;
  text += `MAGIC SELECTION PORTAL - ASSESSMENT TRANSCRIPT\n`;
  text += `====================================================\n\n`;
  
  text += `CANDIDATE: ${assessment.candidate.user.name} (${assessment.candidate.secId})\n`;
  text += `AREA:      ${assessment.caseStudy.area.name}\n`;
  text += `CASE:      ${assessment.caseStudy.title}\n`;
  text += `STATUS:    ${assessment.status}\n`;
  text += `DATE:      ${assessment.completedAt ? new Date(assessment.completedAt).toLocaleString() : 'N/A'}\n\n`;
  
  text += `----------------------------------------------------\n`;
  text += `CONTEXT:\n${assessment.caseStudy.context}\n`;
  text += `----------------------------------------------------\n\n`;

  assessment.caseStudy.questions.forEach((q, idx) => {
    if (q.newInformation) {
      text += `[NEW INFORMATION] -> ${q.newInformation}\n\n`;
    }
    text += `Q${idx + 1}: ${q.questionText}\n\n`;
    
    const response = assessment.responses.find(r => r.questionId === q.id);
    text += `A:\n${response?.answerText || "(No response)"}\n\n`;
    text += `----------------------------------------------------\n\n`;
  });

  if (assessment.evaluation) {
    text += `EVALUATION RESULTS:\n`;
    text += `Total Score: ${assessment.evaluation.totalScore}\n`;
    assessment.evaluation.scores.forEach(s => {
      text += `- ${s.dimension}: ${s.score}/10\n`;
    });
    text += `\nNOTES:\n${assessment.evaluation.notes}\n`;
  } else {
    text += `(No evaluation completed yet)\n`;
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="Transcript_${assessment.candidate.secId}_${assessment.caseStudy.area.name.replace(/\s+/g, '_')}.txt"`
    }
  });
}
