import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BarChart2, Star, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EvaluationsOverviewPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const candidates = await prisma.candidateProfile.findMany({
    include: {
      user: true,
      assessments: {
        include: {
          caseStudy: { include: { area: true } },
          evaluation: true
        }
      }
    }
  });

  // Calculate aggregates
  const evalData = candidates.map(c => {
    const evaluatedAssessments = c.assessments.filter(a => (a.status === "EVALUATED" || !!a.evaluation) && a.evaluation?.totalScore);
    const totalScore = evaluatedAssessments.reduce((sum, a) => sum + (a.evaluation?.totalScore || 0), 0);
    const avgScore = evaluatedAssessments.length > 0 ? (totalScore / evaluatedAssessments.length).toFixed(1) : "N/A";
    
    return {
      ...c,
      evaluatedCount: evaluatedAssessments.length,
      avgScore
    };
  }).sort((a, b) => {
    if (a.avgScore === "N/A") return 1;
    if (b.avgScore === "N/A") return -1;
    return parseFloat(b.avgScore) - parseFloat(a.avgScore);
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
                EVALUATION ROSTER
              </span>
              <span className="text-xs text-slate-400 font-medium">9-Dimension Rubric Aggregates</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Leadership Evaluations Overview
            </h1>
            <p className="text-xs text-slate-400">
              Aggregated rubric scores and capability performance across completed candidate assessments.
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#060813]/60 border-b border-white/[0.06] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Rank & Candidate</th>
                  <th className="py-3 px-4">SEC ID & Dept</th>
                  <th className="py-3 px-4">Assessed Areas</th>
                  <th className="py-3 px-4 text-center">Mean Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                {evalData.map((candidate, idx) => (
                  <tr key={candidate.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-[11px] w-4">{idx + 1}.</span>
                        <span>{candidate.user.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {candidate.secId} <span className="text-slate-500 font-sans">({candidate.department})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.assessments.map(a => (
                          <span 
                            key={a.id} 
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              a.evaluation 
                                ? "bg-violet-600/15 text-violet-300 border-violet-500/20" 
                                : "bg-[#060813] text-slate-500 border-white/[0.06]"
                            }`}
                          >
                            {a.caseStudy.area.name} {a.evaluation?.totalScore && `(${a.evaluation.totalScore.toFixed(1)})`}
                          </span>
                        ))}
                        {candidate.assessments.length === 0 && <span className="text-slate-500 italic text-[11px]">None</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold text-xs ${candidate.avgScore !== "N/A" && parseFloat(candidate.avgScore) >= 7.5 ? "text-emerald-400" : "text-slate-300"}`}>
                        {candidate.avgScore !== "N/A" ? `${candidate.avgScore} / 10` : "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/candidates/${candidate.id}`}
                        className="px-3 py-1.5 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-white/[0.08] transition-all text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>Profile</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
