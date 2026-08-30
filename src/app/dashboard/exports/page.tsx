import { AdminLayout } from "@/components/admin/admin-layout";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Download,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  ArrowUpRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExportsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const assessments = await prisma.assessment.findMany({
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true, questions: true } },
      evaluation: { include: { scores: true } },
      responses: true,
    },
    orderBy: { startedAt: "desc" },
  });

  const finalAllocations = await prisma.finalAllocation.findMany({
    include: {
      candidate: { include: { user: true } },
    },
    orderBy: { roleName: "asc" },
  });

  const isFinalLocked = finalAllocations.length === 7 && finalAllocations.every((a) => a.isLocked);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
                EXPORT CENTER
              </span>
              <span className="text-xs text-slate-400 font-medium">Compliance & Dossiers</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Exports & Official Selection Records
            </h1>
            <p className="text-xs text-slate-400">
              Export verbatim transcripts, evaluation dossiers, and official final selection rosters.
            </p>
          </div>
        </div>

        {/* Master Selection Roster Download Card */}
        <div className="bg-[#0b1021] border border-violet-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded border border-violet-500/25">
                  Master Roster
                </span>
                {isFinalLocked && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck size={11} /> 7 / 7 Positions Finalized & Sealed
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Official MAGIC & Office Bearer Selection Roster
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Export the consolidated selection report including all 5 MAGIC core roles, 2 Office Bearers, candidate SEC IDs, departments, capability areas, and evaluation scores.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <Link
                href="/api/export/final/csv"
                target="_blank"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-2"
              >
                <FileSpreadsheet size={14} />
                <span>Export CSV</span>
              </Link>

              <Link
                href="/api/export/final/json"
                target="_blank"
                className="bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white border border-white/[0.08] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
              >
                <FileCode size={14} />
                <span>Export JSON</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Individual Assessment Transcripts & Dossiers */}
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl shadow-xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText size={16} className="text-violet-400" />
              <span>Assessment Dossiers & Verbatim Transcripts ({assessments.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Download complete verbatim candidate responses, scenario twists, and rubric scores in plaintext or JSON format.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Capability Area</th>
                  <th className="py-3 px-3">Case Study</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                {assessments.map((ass) => {
                  const isEvaluated = ass.status === "EVALUATED" || !!ass.evaluation;

                  return (
                    <tr key={ass.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        {ass.candidate.user.name}
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {ass.candidate.secId}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-600/15 text-violet-300 border border-violet-500/20">
                          {ass.caseStudy.area.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs truncate text-slate-300 font-medium">
                        {ass.caseStudy.title}
                      </td>
                      <td className="py-3 px-3">
                        {isEvaluated ? (
                          <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 size={12} /> Evaluated
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Clock size={12} /> {ass.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/api/export/assessment/${ass.id}/txt`}
                            target="_blank"
                            className="px-2.5 py-1 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] text-[11px] font-medium transition-all"
                          >
                            TXT
                          </Link>
                          <Link
                            href={`/api/export/assessment/${ass.id}/json`}
                            target="_blank"
                            className="px-2.5 py-1 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] text-[11px] font-medium transition-all"
                          >
                            JSON
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
