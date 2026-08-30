"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  BarChart2,
  Sparkles,
  Users,
  ShieldCheck,
  BookOpen
} from "lucide-react";

interface AssessmentItem {
  id: string;
  status: string;
  startedAt: Date | string | null;
  completedAt: Date | string | null;
  candidate: {
    secId: string;
    department: string;
    year: string;
    user: {
      name: string | null;
      email: string | null;
    };
  };
  caseStudy: {
    code?: string | null;
    title: string;
    area: {
      name: string;
    };
    questions: { id: string }[];
  };
  evaluation: {
    totalScore: number | null;
    notes: string | null;
    evaluatedAt: Date | string;
  } | null;
  responses: { id: string }[];
}

export function AssessmentsQueueClient({ assessments }: { assessments: AssessmentItem[] }) {
  const [filter, setFilter] = useState<"ALL" | "NEEDS_REVIEW" | "IN_PROGRESS" | "EVALUATED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssessments = assessments.filter((ass) => {
    const isNeedsReview = ass.status === "COMPLETED" || (ass.status === "SUBMITTED" && !ass.evaluation);
    const isEvaluated = ass.status === "EVALUATED" || !!ass.evaluation;
    const isInProgress = ass.status === "IN_PROGRESS" && !ass.evaluation;

    let matchesFilter = true;
    if (filter === "NEEDS_REVIEW") matchesFilter = isNeedsReview;
    if (filter === "EVALUATED") matchesFilter = isEvaluated;
    if (filter === "IN_PROGRESS") matchesFilter = isInProgress;

    const q = searchQuery.toLowerCase().trim();
    const candidateName = (ass.candidate.user.name || "").toLowerCase();
    const candidateSec = (ass.candidate.secId || "").toLowerCase();
    const areaName = ass.caseStudy.area.name.toLowerCase();
    const caseTitle = ass.caseStudy.title.toLowerCase();

    const matchesSearch =
      q === "" ||
      candidateName.includes(q) ||
      candidateSec.includes(q) ||
      areaName.includes(q) ||
      caseTitle.includes(q);

    return matchesFilter && matchesSearch;
  });

  const needsReviewCount = assessments.filter(
    (a) => a.status === "COMPLETED" || (a.status === "SUBMITTED" && !a.evaluation)
  ).length;
  const inProgressCount = assessments.filter((a) => a.status === "IN_PROGRESS").length;
  const evaluatedCount = assessments.filter((a) => a.status === "EVALUATED" || !!a.evaluation).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
              ASSESSMENT QUEUE
            </span>
            <span className="text-xs text-slate-400 font-medium">Evaluation Workflow</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Assessment Submissions & Review Queue
          </h1>
          <p className="text-xs text-slate-400">
            Inspect verbatim transcripts, analyze leadership trade-offs, and conduct 9-dimension rubric evaluations.
          </p>
        </div>

        <Link
          href="/dashboard/evaluations"
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <BarChart2 size={15} />
          <span>Evaluations Overview</span>
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0b1021] border border-white/[0.08] p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Submissions</span>
          <div className="text-xl font-bold text-white">{assessments.length}</div>
        </div>

        <div className="bg-[#0b1021] border border-amber-500/20 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Needs Review</span>
          <div className="text-xl font-bold text-amber-400">{needsReviewCount}</div>
        </div>

        <div className="bg-[#0b1021] border border-emerald-500/20 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Evaluated</span>
          <div className="text-xl font-bold text-emerald-400">{evaluatedCount}</div>
        </div>

        <div className="bg-[#0b1021] border border-white/[0.08] p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">In Progress</span>
          <div className="text-xl font-bold text-slate-300">{inProgressCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, case, area..."
            className="w-full bg-[#060813] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
                : "bg-[#060813] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
            }`}
          >
            All ({assessments.length})
          </button>
          <button
            onClick={() => setFilter("NEEDS_REVIEW")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === "NEEDS_REVIEW"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                : "bg-[#060813] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
            }`}
          >
            Needs Review ({needsReviewCount})
          </button>
          <button
            onClick={() => setFilter("EVALUATED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === "EVALUATED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                : "bg-[#060813] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
            }`}
          >
            Evaluated ({evaluatedCount})
          </button>
          <button
            onClick={() => setFilter("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === "IN_PROGRESS"
                ? "bg-slate-700 text-white font-bold"
                : "bg-[#060813] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
        </div>
      </div>

      {/* Assessment Table */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#060813]/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Capability Area</th>
                <th className="py-3 px-4">Case Study</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status & Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No assessments match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((ass) => {
                  const isEvaluated = ass.status === "EVALUATED" || !!ass.evaluation;
                  const isCompleted = ass.status === "COMPLETED" || ass.status === "SUBMITTED";

                  return (
                    <tr key={ass.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{ass.candidate.user.name}</div>
                        <div className="font-mono text-slate-400 text-[10px]">{ass.candidate.secId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-600/15 text-violet-300 border border-violet-500/20">
                          {ass.caseStudy.area.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-300 font-medium">
                        {ass.caseStudy.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {ass.responses.length} / {ass.caseStudy.questions.length} Ans
                      </td>
                      <td className="py-3.5 px-4">
                        {isEvaluated && ass.evaluation?.totalScore ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={11} /> {ass.evaluation.totalScore.toFixed(1)} / 10
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock size={11} /> Needs Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            In Progress
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/dashboard/assessments/${ass.id}`}
                          className="px-3 py-1.5 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-white/[0.08] transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Review</span>
                          <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
