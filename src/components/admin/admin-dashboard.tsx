import { AdminLayout } from "./admin-layout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Briefcase,
  BookOpen,
  BarChart2,
  GitCompare,
  ShieldCheck,
  Download,
  History,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  AlertCircle,
  ExternalLink,
  Shield
} from "lucide-react";

export async function AdminDashboard({ userId }: { userId: string }) {
  // Fetch stats
  const candidateCount = await prisma.candidateProfile.count();
  const areaCount = await prisma.capabilityArea.count();
  const caseStudyCount = await prisma.caseStudy.count();
  const lockedAssignmentsCount = await prisma.areaAssignment.count({ where: { isLocked: true } });
  const totalAssessmentsCount = await prisma.assessment.count();
  const completedAssessmentsCount = await prisma.assessment.count({
    where: { status: { in: ["COMPLETED", "EVALUATED"] } },
  });
  const evaluatedCount = await prisma.assessment.count({
    where: { status: "EVALUATED" },
  });
  const finalAllocations = await prisma.finalAllocation.findMany({
    include: { candidate: { include: { user: true } } }
  });
  const isFinalLocked = finalAllocations.length === 7 && finalAllocations.every((a) => a.isLocked);

  const candidates = await prisma.candidateProfile.findMany({
    include: {
      user: true,
      assignments: { include: { area: true } },
      assessments: true,
      finalAllocations: true
    },
    orderBy: { user: { name: "asc" } }
  });

  const recentLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        
        {/* Command Center Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
                GOVERNANCE CONTROL CENTER
              </span>
              <span className="text-xs text-slate-400 font-medium">GDSC Leadership Selection</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              MAGIC Selection Command Center
            </h1>
            <p className="text-xs text-slate-400">
              Deterministic selection governance for 7 Core Leaders across 5 MAGIC + 2 Executive Office Bearer roles.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {isFinalLocked ? (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <Lock size={12} />
                <span>Final Selection Sealed</span>
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Clock size={12} />
                <span>Selection In Progress</span>
              </span>
            )}
          </div>
        </div>

        {/* Top KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Candidates Pool"
            value={`${candidateCount} / 7`}
            subtitle="Verified student profiles"
            icon={<Users size={20} className="text-violet-400" />}
          />
          <StatCard
            title="Case Study Bank"
            value={`${caseStudyCount} Cases`}
            subtitle="180 questions across 6 areas"
            icon={<BookOpen size={20} className="text-indigo-400" />}
          />
          <StatCard
            title="Assessments Finished"
            value={`${completedAssessmentsCount} / ${totalAssessmentsCount || candidateCount}`}
            subtitle={`${evaluatedCount} evaluated with rubric`}
            icon={<CheckCircle2 size={20} className="text-emerald-400" />}
          />
          <StatCard
            title="Final 7 Allocation"
            value={isFinalLocked ? "7 / 7 Sealed" : `${finalAllocations.length} / 7 Assigned`}
            subtitle="5 MAGIC + 2 Office Bearers"
            icon={<ShieldCheck size={20} className="text-amber-400" />}
          />
        </div>

        {/* Main Process Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            <span>Selection Process Modules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModuleCard
              href="/dashboard/allocation"
              title="1. Capability Allocation"
              description="Record consensus choices, verify capacity (max 2), and lock assignments."
              badge={`${lockedAssignmentsCount} Areas Locked`}
              icon={<Briefcase size={18} className="text-violet-400" />}
            />

            <ModuleCard
              href="/dashboard/cases"
              title="2. Case Study Bank"
              description="Inspect 18 full leadership cases, stakeholders, constraints, and progressive twists."
              badge="18 Cases • 6 Areas"
              icon={<BookOpen size={18} className="text-indigo-400" />}
            />

            <ModuleCard
              href="/dashboard/assessments"
              title="3. Assessment Queue"
              description="Review verbatim transcripts, candidate answers, and twist reveal responses."
              badge={`${completedAssessmentsCount} Completed`}
              icon={<FileText size={18} className="text-amber-400" />}
            />

            <ModuleCard
              href="/dashboard/evaluations"
              title="4. Leadership Evaluations"
              description="Score candidate performance across the 9-dimension leadership rubric."
              badge={`${evaluatedCount} Evaluated`}
              icon={<BarChart2 size={18} className="text-emerald-400" />}
            />

            <ModuleCard
              href="/dashboard/comparison"
              title="5. Candidate Comparison"
              description="Side-by-side performance radar, original answers, and meeting observations."
              badge="Radar & Metrics"
              icon={<GitCompare size={18} className="text-cyan-400" />}
            />

            <ModuleCard
              href="/dashboard/final"
              title="6. Final 7 Allocation Matrix"
              description="Assign exactly 5 MAGIC Core + 2 Executive Office Bearer positions."
              badge={isFinalLocked ? "Sealed & Locked" : "Pending Selection"}
              icon={<ShieldCheck size={18} className="text-violet-400" />}
            />
          </div>
        </div>

        {/* Candidate Pool Quick Overview Table */}
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users size={16} className="text-violet-400" />
                <span>Candidate Pool Overview (7 Candidates)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Current allocation and assessment status across the candidate roster.
              </p>
            </div>

            <Link
              href="/dashboard/candidates"
              className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Manage Candidates</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">SEC ID</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Assigned Areas</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                {candidates.map((cand) => {
                  const isLocked = cand.assignments.length > 0 && cand.assignments.every((a) => a.isLocked);
                  const completedAssessments = cand.assessments.filter((a) => a.status === "COMPLETED" || a.status === "EVALUATED").length;

                  return (
                    <tr key={cand.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        {cand.user.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {cand.secId}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {cand.department}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {cand.assignments.length === 0 ? (
                            <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                          ) : (
                            cand.assignments.map((a) => (
                              <span
                                key={a.id}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-600/15 text-violet-300 border border-violet-500/20"
                              >
                                {a.area.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {cand.finalAllocations && cand.finalAllocations.length > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                            {cand.finalAllocations[0].roleName}
                          </span>
                        ) : isLocked ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Locked & Ready
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pending Lock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/dashboard/candidates/${cand.id}`}
                          className="px-2.5 py-1 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] transition-all text-[11px] font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Audit Trail Activity Preview */}
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <History size={16} className="text-violet-400" />
                <span>Recent System Audit Log</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time cryptographic trail of administrative selection actions.
              </p>
            </div>

            <Link
              href="/dashboard/audit"
              className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
            >
              <span>Full Audit Trail</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#060813] border border-white/[0.06] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-violet-600/15 text-violet-300 border border-violet-500/20">
                    {log.action}
                  </span>
                  <span className="text-slate-300 truncate max-w-sm sm:max-w-md font-mono text-[11px]">
                    {log.details.slice(0, 80)}...
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#0b1021] border border-white/[0.08] p-5 rounded-2xl shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <div className="p-2 rounded-xl bg-[#060813] border border-white/[0.06]">{icon}</div>
      </div>
      <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">{value}</div>
      <p className="text-[11px] text-slate-500">{subtitle}</p>
    </div>
  );
}

function ModuleCard({
  href,
  title,
  description,
  badge,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group bg-[#0b1021] border border-white/[0.08] hover:border-white/[0.14] p-5 rounded-2xl shadow-lg flex flex-col justify-between space-y-4 transition-all"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-[#060813] border border-white/[0.06]">{icon}</div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/[0.06]">
            {badge}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors gap-1 pt-2 border-t border-white/[0.04]">
        <span>Open Module</span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
