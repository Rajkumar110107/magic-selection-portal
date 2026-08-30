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

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Transcript - ${assessment.candidate.user.name}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
        .meta { background: #f4f4f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .meta p { margin: 5px 0; }
        .question { font-weight: bold; margin-top: 30px; }
        .answer { background: #fafafa; border-left: 4px solid #8b5cf6; padding: 15px; margin-top: 10px; white-space: pre-wrap; }
        .new-info { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 15px; font-style: italic; }
        .eval { margin-top: 40px; border-top: 2px solid #333; padding-top: 20px; }
        @media print {
          body { padding: 0; }
          .answer { border-left: 2px solid #000; }
        }
      </style>
    </head>
    <body onload="window.print()">
      <h1>MAGIC Selection Transcript</h1>
      
      <div class="meta">
        <p><strong>Candidate:</strong> ${assessment.candidate.user.name} (${assessment.candidate.secId})</p>
        <p><strong>Area:</strong> ${assessment.caseStudy.area.name}</p>
        <p><strong>Case Study:</strong> ${assessment.caseStudy.title}</p>
        <p><strong>Completed:</strong> ${assessment.completedAt ? new Date(assessment.completedAt).toLocaleString() : 'N/A'}</p>
      </div>

      <div style="margin-bottom: 40px;">
        <h3>Context</h3>
        <p>${assessment.caseStudy.context}</p>
      </div>

      ${assessment.caseStudy.questions.map((q, idx) => {
        const response = assessment.responses.find(r => r.questionId === q.id);
        return `
          <div>
            ${q.newInformation ? `<div class="new-info"><strong>New Information:</strong> ${q.newInformation}</div>` : ''}
            <div class="question">Q${idx + 1}. ${q.questionText}</div>
            <div class="answer">${response?.answerText || "(No response provided)"}</div>
          </div>
        `;
      }).join('')}

      ${assessment.evaluation ? `
        <div class="eval">
          <h2>Evaluation Results</h2>
          <p><strong>Total Score:</strong> ${assessment.evaluation.totalScore?.toFixed(1) ?? 'N/A'} / 10</p>
          <ul>
            ${assessment.evaluation.scores.map(s => `<li>${s.dimension}: ${s.score}/10</li>`).join('')}
          </ul>
          <h3>Notes</h3>
          <div class="answer">${assessment.evaluation.notes}</div>
        </div>
      ` : ''}
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    }
  });
}
