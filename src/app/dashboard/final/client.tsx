"use client";

import { useState } from "react";
import { saveFinalAllocations, unlockFinalAllocations, MAGIC_ROLES, OB_ROLES, ALL_FINAL_ROLES } from "./actions";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  Award,
  Sparkles,
  Search,
  Compass,
  Megaphone,
  Radio,
  Crown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Eye,
  X,
  Star,
  BookOpen,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

interface CandidateData {
  id: string;
  secId: string;
  department: string;
  year: string;
  section: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
  assignments: {
    id: string;
    area: {
      id: string;
      name: string;
      hiddenRole: string;
    };
  }[];
  assessments: {
    id: string;
    status: string;
    caseStudy: {
      title: string;
      area: { name: string };
    };
    evaluation: {
      totalScore: number | null;
      notes: string | null;
      scores: { dimension: string; score: number }[];
    } | null;
  }[];
  teamObservations: {
    observation: {
      teamworkRating: number | null;
      communicationRating: number | null;
      listeningRating: number | null;
      leadershipRating: number | null;
      respectRating: number | null;
      overallNotes: string | null;
      area: { name: string };
    };
  }[];
}

interface FinalAllocationRecord {
  id: string;
  candidateProfileId: string;
  roleName: string;
  isLocked: boolean;
  allocatedAt: Date | string;
  candidate: {
    user: { name: string | null };
  };
}

const ROLE_METADATA: Record<string, { category: "MAGIC" | "OB"; description: string; color: string; icon: any }> = {
  Mastermind: {
    category: "MAGIC",
    description: "Strategic Vision, Long-Term Roadmapping & System Architecture",
    color: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    icon: Sparkles,
  },
  Advocate: {
    category: "MAGIC",
    description: "Community Advocacy, Developer Outreach & Inclusive Growth",
    color: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    icon: Megaphone,
  },
  Guide: {
    category: "MAGIC",
    description: "Technical Mentorship, Capability Enablement & Knowledge Sharing",
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    icon: Compass,
  },
  Investigator: {
    category: "MAGIC",
    description: "Deep Technical Exploration, Research & Quality Discovery",
    color: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    icon: Search,
  },
  Communicator: {
    category: "MAGIC",
    description: "Stakeholder Relations, Public Storytelling & Team Synchronization",
    color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    icon: Radio,
  },
  "Co-Lead": {
    category: "OB",
    description: "Executive Operations, Leadership Delegation & Organizational Alignment",
    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    icon: Crown,
  },
  "Office Bearer": {
    category: "OB",
    description: "Core Chapter Governance, Event Logistics & Program Execution",
    color: "bg-slate-700/20 border-slate-600/30 text-slate-300",
    icon: Award,
  },
};

export function FinalAllocationClient({
  candidates,
  existingAllocations,
  capabilityAreas,
}: {
  candidates: CandidateData[];
  existingAllocations: FinalAllocationRecord[];
  capabilityAreas: any[];
}) {
  const [roleAllocations, setRoleAllocations] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    existingAllocations.forEach((a) => {
      map[a.roleName] = a.candidateProfileId;
    });
    return map;
  });

  const isLocked = existingAllocations.length > 0 && existingAllocations.every((a) => a.isLocked);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const getCandidateScore = (c: CandidateData) => {
    const evaluated = c.assessments.filter((a) => a.evaluation?.totalScore);
    if (evaluated.length === 0) return null;
    const avg = evaluated.reduce((sum, a) => sum + (a.evaluation?.totalScore || 0), 0) / evaluated.length;
    return avg.toFixed(1);
  };

  const handleRoleChange = (roleName: string, candidateProfileId: string) => {
    if (isLocked) return;

    setRoleAllocations((prev) => {
      const next = { ...prev };

      if (candidateProfileId) {
        Object.keys(next).forEach((r) => {
          if (next[r] === candidateProfileId && r !== roleName) {
            delete next[r];
          }
        });
      }

      if (candidateProfileId) {
        next[roleName] = candidateProfileId;
      } else {
        delete next[roleName];
      }

      return next;
    });
    setStatusMsg(null);
  };

  const assignedCandidateIds = Object.values(roleAllocations).filter(Boolean);
  const uniqueAssignedCandidates = new Set(assignedCandidateIds);
  const magicAssignedCount = MAGIC_ROLES.filter((r) => !!roleAllocations[r]).length;
  const obAssignedCount = OB_ROLES.filter((r) => !!roleAllocations[r]).length;
  const all7Valid =
    magicAssignedCount === 5 &&
    obAssignedCount === 2 &&
    uniqueAssignedCandidates.size === 7 &&
    assignedCandidateIds.length === 7;

  const handleLockSubmit = async () => {
    if (!all7Valid) {
      setStatusMsg({
        type: "error",
        text: "Please assign all 5 MAGIC roles and both 2 Office Bearer roles across all 7 distinct candidates.",
      });
      return;
    }

    try {
      setLoading(true);
      setStatusMsg(null);

      const payload = ALL_FINAL_ROLES.map((roleName) => ({
        roleName,
        candidateProfileId: roleAllocations[roleName],
      }));

      const res = await saveFinalAllocations(payload);
      if (res.success) {
        setShowConfirmModal(false);
        setStatusMsg({
          type: "success",
          text: "Final selection successfully locked! Official records updated.",
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to lock final selection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockSubmit = async () => {
    try {
      setLoading(true);
      setStatusMsg(null);

      const res = await unlockFinalAllocations();
      if (res.success) {
        setShowUnlockModal(false);
        setStatusMsg({
          type: "success",
          text: "Selection unlocked. You may modify role allocations.",
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to unlock selection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
              FINAL ALLOCATION
            </span>
            <span className="text-xs text-slate-400 font-medium">5 MAGIC + 2 OB Roles</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Final MAGIC & Office Bearer Allocation Matrix
          </h1>
          <p className="text-xs text-slate-400">
            Assign exactly 5 MAGIC Core roles and 2 Executive Office Bearers across all 7 candidates.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {isLocked ? (
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <Lock size={13} />
                <span>FINAL ALLOCATION SEALED</span>
              </span>
              <button
                onClick={() => setShowUnlockModal(true)}
                className="px-3.5 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-xl border border-white/[0.08] transition-all flex items-center gap-1 cursor-pointer"
              >
                <Unlock size={13} />
                <span>Unlock</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!all7Valid || loading}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/30 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={14} />}
              <span>Seal Final Selection</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border shadow-sm ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={15} className="shrink-0 text-red-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Validation Checklist Strip */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Allocation Checklist (7 Total Positions)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Strict 1-to-1 bijection. Exactly 5 MAGIC + 1 Co-Lead + 1 Office Bearer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`px-3 py-1 rounded-xl font-semibold border ${
              magicAssignedCount === 5
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-[#060813] text-slate-400 border-white/[0.06]"
            }`}
          >
            MAGIC Core: {magicAssignedCount} / 5
          </span>

          <span
            className={`px-3 py-1 rounded-xl font-semibold border ${
              obAssignedCount === 2
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-[#060813] text-slate-400 border-white/[0.06]"
            }`}
          >
            Office Bearers: {obAssignedCount} / 2
          </span>

          <span
            className={`px-3 py-1 rounded-xl font-semibold border ${
              uniqueAssignedCandidates.size === 7
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-[#060813] text-slate-400 border-white/[0.06]"
            }`}
          >
            Distinct Candidates: {uniqueAssignedCandidates.size} / 7
          </span>
        </div>
      </div>

      {/* Section 1: MAGIC Core Roles (5 Positions) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-violet-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            MAGIC Leadership Core (5 Roles)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAGIC_ROLES.map((roleName) => {
            const meta = ROLE_METADATA[roleName];
            const Icon = meta.icon;
            const assignedCandidateId = roleAllocations[roleName];
            const assignedCandidate = candidates.find((c) => c.id === assignedCandidateId);
            const score = assignedCandidate ? getCandidateScore(assignedCandidate) : null;

            return (
              <div
                key={roleName}
                className={`bg-[#0b1021] border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                  assignedCandidate
                    ? "border-violet-500/30"
                    : "border-white/[0.08]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl border ${meta.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider">
                        MAGIC Core
                      </span>
                      <h3 className="text-sm font-bold text-white">{roleName}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
                    {meta.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Assigned Candidate
                    </label>
                    <select
                      value={assignedCandidateId || ""}
                      onChange={(e) => handleRoleChange(roleName, e.target.value)}
                      disabled={isLocked}
                      className="w-full bg-[#060813] border border-white/[0.08] focus:border-violet-500/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-60"
                    >
                      <option value="">-- Select Candidate --</option>
                      {candidates.map((c) => {
                        const isAssignedElsewhere =
                          Object.entries(roleAllocations).some(
                            ([r, id]) => id === c.id && r !== roleName
                          );
                        const cScore = getCandidateScore(c);

                        return (
                          <option
                            key={c.id}
                            value={c.id}
                            disabled={isAssignedElsewhere}
                          >
                            {c.user.name} ({c.secId}) {cScore ? `— Score: ${cScore}` : ""} {isAssignedElsewhere ? `[Assigned]` : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Executive Office Bearers (2 Positions) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2">
          <Crown size={16} className="text-amber-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Executive Office Bearers (2 Roles)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OB_ROLES.map((roleName) => {
            const meta = ROLE_METADATA[roleName];
            const Icon = meta.icon;
            const assignedCandidateId = roleAllocations[roleName];
            const assignedCandidate = candidates.find((c) => c.id === assignedCandidateId);
            const score = assignedCandidate ? getCandidateScore(assignedCandidate) : null;

            return (
              <div
                key={roleName}
                className={`bg-[#0b1021] border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                  assignedCandidate
                    ? "border-amber-500/30"
                    : "border-white/[0.08]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl border ${meta.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Executive Office Bearer
                      </span>
                      <h3 className="text-sm font-bold text-white">{roleName}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
                    {meta.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Assigned Candidate
                    </label>
                    <select
                      value={assignedCandidateId || ""}
                      onChange={(e) => handleRoleChange(roleName, e.target.value)}
                      disabled={isLocked}
                      className="w-full bg-[#060813] border border-white/[0.08] focus:border-amber-500/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-60"
                    >
                      <option value="">-- Select Candidate --</option>
                      {candidates.map((c) => {
                        const isAssignedElsewhere =
                          Object.entries(roleAllocations).some(
                            ([r, id]) => id === c.id && r !== roleName
                          );
                        const cScore = getCandidateScore(c);

                        return (
                          <option
                            key={c.id}
                            value={c.id}
                            disabled={isAssignedElsewhere}
                          >
                            {c.user.name} ({c.secId}) {cScore ? `— Score: ${cScore}` : ""} {isAssignedElsewhere ? `[Assigned]` : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Final Lock */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-emerald-400">
              <ShieldCheck size={22} />
              <h3 className="text-base font-bold text-white">Seal Final 7 Selection?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Confirming will seal the 7 leadership assignments and generate official selection export documents.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLockSubmit}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                <span>Confirm & Seal Selection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Unlock */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-400">
              <Unlock size={22} />
              <h3 className="text-base font-bold text-white">Unlock Final Allocations?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unlocking permits modifying the 7 final positions. This action will be logged in the security audit trail.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlockSubmit}
                disabled={loading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Unlock size={13} />}
                <span>Confirm Unlock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
