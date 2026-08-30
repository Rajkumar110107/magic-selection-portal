import { prisma } from "@/lib/prisma";
import { LogOut, Lock, Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, BookOpen, FileCheck2, User, Sparkles } from "lucide-react";
import { signOut } from "@/auth";
import Link from "next/link";
import { StartAssessmentButton } from "./start-assessment-button";

export async function CandidateDashboard({ userId }: { userId: string }) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      assignments: {
        include: {
          area: true,
        }
      },
      assessments: {
        include: {
          caseStudy: {
            include: { area: true }
          },
          evaluation: true,
          responses: true
        }
      }
    }
  });

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#060813] text-slate-100 flex items-center justify-center p-6">
        <div className="bg-[#0b1021] border border-white/[0.08] p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-xl">
          <AlertCircle size={36} className="mx-auto text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Candidate Profile Not Found</h2>
          <p className="text-xs text-slate-400">Please contact the portal administrator.</p>
        </div>
      </div>
    );
  }

  const isAllLocked = profile.assignments.length > 0 && profile.assignments.every(a => a.isLocked);

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Candidate Profile Hero Card */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0b1021] p-6 rounded-2xl border border-white/[0.08] shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                Candidate Assessment Portal
              </span>
              {isAllLocked && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Lock size={10} /> Verified & Locked
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {profile.user.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              <span className="text-slate-200">{profile.secId}</span> • {profile.department} • {profile.year} {profile.section ? `(Sec ${profile.section})` : ""}
            </p>
          </div>

          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="px-3.5 py-2 bg-[#060813] hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-xl transition-all flex items-center space-x-2 text-xs font-semibold border border-white/[0.08] hover:border-red-500/20 cursor-pointer">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>

        {/* Assigned Capability Areas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={20} className="text-violet-400" />
              <span>Your Allocated Capability Areas</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {profile.assignments.length} Area{profile.assignments.length === 1 ? "" : "s"} Assigned
            </span>
          </div>

          {profile.assignments.length === 0 ? (
            <div className="bg-[#0b1021] border border-white/[0.08] p-8 sm:p-12 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Clock size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Capability Areas Awaiting Allocation</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Your assigned capability areas will appear here following the physical selection meeting consensus. Once locked by administrators, your tailored leadership case studies will be ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {profile.assignments.map(assignment => {
                const assessment = profile.assessments.find(
                  ass => ass.caseStudy.capabilityAreaId === assignment.capabilityAreaId
                );

                let displayStatus: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EVALUATED" | "PENDING_LOCK" = "PENDING_LOCK";
                if (!assignment.isLocked) {
                  displayStatus = "PENDING_LOCK";
                } else if (!assessment) {
                  displayStatus = "NOT_STARTED";
                } else if (assessment.evaluation) {
                  displayStatus = "EVALUATED";
                } else if (assessment.status === "COMPLETED" || assessment.status === "SUBMITTED") {
                  displayStatus = "SUBMITTED";
                } else {
                  displayStatus = "IN_PROGRESS";
                }

                return (
                  <div
                    key={assignment.id}
                    className="bg-[#0b1021] border border-white/[0.08] hover:border-white/[0.14] p-5 sm:p-6 rounded-2xl relative overflow-hidden shadow-lg flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div className="space-y-2.5">
                      {/* Status Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                            Capability Assessment
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                            {assignment.area.name}
                          </h3>
                        </div>

                        {displayStatus === "EVALUATED" && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[11px] px-2.5 py-1 rounded-lg font-semibold border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Evaluated</span>
                          </span>
                        )}

                        {displayStatus === "SUBMITTED" && (
                          <span className="bg-cyan-500/10 text-cyan-400 text-[11px] px-2.5 py-1 rounded-lg font-semibold border border-cyan-500/20 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Submitted</span>
                          </span>
                        )}

                        {displayStatus === "IN_PROGRESS" && (
                          <span className="bg-amber-500/10 text-amber-400 text-[11px] px-2.5 py-1 rounded-lg font-semibold border border-amber-500/20 flex items-center gap-1">
                            <Clock size={12} />
                            <span>In Progress</span>
                          </span>
                        )}

                        {displayStatus === "NOT_STARTED" && (
                          <span className="bg-violet-500/10 text-violet-300 text-[11px] px-2.5 py-1 rounded-lg font-semibold border border-violet-500/20">
                            Ready to Start
                          </span>
                        )}

                        {displayStatus === "PENDING_LOCK" && (
                          <span className="bg-slate-500/10 text-slate-400 text-[11px] px-2.5 py-1 rounded-lg font-semibold border border-slate-700/40">
                            Pending Lock
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {assignment.area.description}
                      </p>
                    </div>

                    {/* Action Area */}
                    <div className="pt-2 border-t border-white/[0.06]">
                      {displayStatus === "PENDING_LOCK" && (
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 py-1">
                          <Lock size={13} className="text-slate-500" />
                          <span>Awaiting Administrator confirmation to unlock case.</span>
                        </div>
                      )}

                      {displayStatus === "NOT_STARTED" && (
                        <StartAssessmentButton assignmentId={assignment.id} />
                      )}

                      {displayStatus === "IN_PROGRESS" && assessment && (
                        <Link
                          href={`/assessment/${assessment.id}`}
                          className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-violet-900/30 transition-all"
                        >
                          <BookOpen size={14} />
                          <span>Resume Assessment ({assessment.responses.length}/10 answered)</span>
                          <ArrowRight size={14} />
                        </Link>
                      )}

                      {(displayStatus === "SUBMITTED" || displayStatus === "EVALUATED") && assessment && (
                        <Link
                          href={`/assessment/${assessment.id}`}
                          className="w-full bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-white/[0.08] transition-all"
                        >
                          <FileCheck2 size={14} />
                          <span>View Submitted Responses</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Assessment Guide & Protocol Card */}
        <div className="bg-[#0b1021] border border-white/[0.08] p-5 sm:p-6 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={15} className="text-violet-400" />
            <span>Assessment Protocol Guidelines</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 font-bold">•</span>
              <span><strong>10 Sequential Questions:</strong> Questions evaluate understanding, prioritization, adaptation, and leadership decision-making.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 font-bold">•</span>
              <span><strong>Progressive Scenarios:</strong> Emerging circumstances and new information will be revealed as you advance.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 font-bold">•</span>
              <span><strong>Real-Time Autosave:</strong> Your responses are automatically saved as you write. You may resume anytime.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-violet-400 font-bold">•</span>
              <span><strong>Final Review & Submit:</strong> Once you submit Question 10, your assessment is permanently locked for board evaluation.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
