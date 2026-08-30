import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  User,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Tag
} from "lucide-react";
import { EvaluationForm } from "./evaluation-form";

export default async function AssessmentReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      candidate: { include: { user: true } },
      caseStudy: {
        include: {
          area: true,
          questions: { orderBy: { orderNumber: "asc" } },
        },
      },
      responses: true,
      evaluation: { include: { scores: true, admin: true } },
    },
  });

  if (!assessment) return notFound();

  // Create Transcript
  const transcript = assessment.caseStudy.questions.map((q) => {
    const response = assessment.responses.find((r) => r.questionId === q.id);
    return {
      question: q,
      answer: response?.answerText || "",
      submittedAt: response?.submittedAt || null,
    };
  });

  const answeredCount = assessment.responses.length;
  const isEvaluated = assessment.status === "EVALUATED" || !!assessment.evaluation;
  const isSubmitted = assessment.status === "COMPLETED" || assessment.status === "SUBMITTED";

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link
              href="/dashboard/assessments"
              className="text-primary hover:text-primary-foreground hover:underline inline-flex items-center text-xs font-semibold mb-2"
            >
              <ArrowLeft size={14} className="mr-1" /> Back to Assessment Queue
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                {assessment.caseStudy.code || "CASE"}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {assessment.caseStudy.area.name}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mt-1">
              {assessment.candidate.user.name} — Full Assessment Transcript
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              <strong>{assessment.candidate.secId}</strong> • {assessment.candidate.department} ({assessment.candidate.year})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/api/export/${assessment.id}/txt`}
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center border border-slate-700 transition-colors"
            >
              <Download size={14} className="mr-1.5 text-cyan-400" /> Export TXT
            </Link>
            <Link
              href={`/api/export/${assessment.id}/pdf`}
              target="_blank"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center transition-colors"
            >
              <Download size={14} className="mr-1.5" /> Export PDF
            </Link>
          </div>
        </div>

        {/* Assessment Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#0a0f1e] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              Status
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              {isEvaluated ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Evaluated
                </span>
              ) : isSubmitted ? (
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <AlertCircle size={13} /> Needs Review (Submitted)
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock size={13} /> In Progress
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#0a0f1e] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              Responses Captured
            </span>
            <div className="mt-1 font-mono font-bold text-slate-200">
              {answeredCount} / {assessment.caseStudy.questions.length} Questions Answered
            </div>
          </div>

          <div className="bg-[#0a0f1e] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              Started At
            </span>
            <div className="mt-1 text-slate-300">
              {assessment.startedAt ? new Date(assessment.startedAt).toLocaleString() : "N/A"}
            </div>
          </div>

          <div className="bg-[#0a0f1e] border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              Completed At
            </span>
            <div className="mt-1 text-slate-300">
              {assessment.completedAt ? new Date(assessment.completedAt).toLocaleString() : "Still In Progress"}
            </div>
          </div>
        </div>

        {/* Main Content Grid: Transcript (2 cols) + Evaluation Panel (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transcript Viewer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Background Card */}
            <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/60 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                    {assessment.caseStudy.code || "CASE"}
                  </span>
                  <span className="text-xs text-slate-400">{assessment.caseStudy.area.name}</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-100">
                  {assessment.caseStudy.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {assessment.caseStudy.background || assessment.caseStudy.context}
                </p>
              </div>

              {/* Chronological Questions and Exact Answers */}
              <div className="p-6 space-y-8">
                {transcript.map((item, index) => (
                  <div
                    key={item.question.id}
                    className="space-y-3 border-b border-slate-800/60 pb-8 last:border-b-0 last:pb-0"
                  >
                    {/* Progressive Twist / Information if revealed */}
                    {item.question.newInformation && (
                      <div className="bg-amber-950/20 border-l-4 border-amber-500 border border-amber-900/40 p-4 rounded-r-xl shadow-md space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <AlertCircle size={13} />
                          Progressive Twist / Information Revealed Before Question {index + 1}
                        </span>
                        <p className="text-xs text-amber-200/90 leading-relaxed">
                          {item.question.newInformation}
                        </p>
                      </div>
                    )}

                    {/* Question Prompt Header */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-primary">
                          Question {index + 1} of {assessment.caseStudy.questions.length}
                        </span>
                        {item.submittedAt && (
                          <span className="text-[10px] text-slate-500">
                            Answered at {new Date(item.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-slate-200 leading-relaxed">
                        {item.question.questionText}
                      </p>
                    </div>

                    {/* Exact Candidate Response */}
                    <div className="bg-[#05050f] border border-slate-800 rounded-xl p-4 text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {item.answer.trim() ? (
                        item.answer
                      ) : (
                        <span className="text-slate-600 italic">No response provided for this question.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Evaluation Form */}
          <div className="lg:col-span-1">
            <EvaluationForm assessment={assessment} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
