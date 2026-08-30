"use client";

import { useState } from "react";
import {
  assignArea,
  removeArea,
  toggleLock,
  lockAllAssignments,
  saveTeamObservation
} from "./actions";
import {
  Lock,
  Unlock,
  Plus,
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Users,
  MessageSquare,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock
} from "lucide-react";

type Props = {
  candidates: any[];
  areas: any[];
  observations: any[];
};

export function AllocationClient({ candidates, areas, observations }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals / Dialog state
  const [confirmLockModal, setConfirmLockModal] = useState<{
    open: boolean;
    candidateId?: string;
    candidateName?: string;
    isBulk?: boolean;
  }>({ open: false });

  const [confirmUnlockModal, setConfirmUnlockModal] = useState<{
    open: boolean;
    candidateId?: string;
    candidateName?: string;
  }>({ open: false });

  // Overlap Observation Form State
  const [showObservationForm, setShowObservationForm] = useState(false);
  const [obsAreaId, setObsAreaId] = useState(areas[0]?.id || "");
  const [obsCandidateIds, setObsCandidateIds] = useState<string[]>([]);
  const [obsOverlapStatus, setObsOverlapStatus] = useState("DISCUSSED");
  const [obsDiscussionNotes, setObsDiscussionNotes] = useState("");
  const [obsOutcome, setObsOutcome] = useState("");
  const [obsOverallNotes, setObsOverallNotes] = useState("");
  const [obsRatings, setObsRatings] = useState({
    teamwork: 8,
    communication: 8,
    listening: 8,
    negotiation: 7,
    leadership: 8,
    respect: 9,
    adaptability: 8,
    teamFirst: 8
  });

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAssign = async (candidateId: string, areaId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await assignArea(candidateId, areaId);
      setSuccess("Capability area assigned successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to assign area");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (assignmentId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await removeArea(assignmentId);
      setSuccess("Capability area assignment removed.");
    } catch (err: any) {
      setError(err.message || "Failed to remove area");
    } finally {
      setLoading(false);
    }
  };

  const handleLockCandidate = async (candidateId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await toggleLock(candidateId, true);
      setSuccess("Candidate capability assignments locked.");
      setConfirmLockModal({ open: false });
    } catch (err: any) {
      setError(err.message || "Failed to lock assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockCandidate = async (candidateId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await toggleLock(candidateId, false);
      setSuccess("Candidate capability assignments unlocked.");
      setConfirmUnlockModal({ open: false });
    } catch (err: any) {
      setError(err.message || "Failed to unlock assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkLock = async () => {
    try {
      setLoading(true);
      clearMessages();
      const res = await lockAllAssignments();
      setSuccess(`Locked ${res.count} candidate(s) successfully.`);
      setConfirmLockModal({ open: false });
    } catch (err: any) {
      setError(err.message || "Failed to bulk lock assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsAreaId || obsCandidateIds.length === 0) {
      setError("Please select a capability area and at least one candidate participant.");
      return;
    }

    try {
      setLoading(true);
      clearMessages();
      await saveTeamObservation({
        capabilityAreaId: obsAreaId,
        candidateProfileIds: obsCandidateIds,
        overlapStatus: obsOverlapStatus,
        discussionNotes: obsDiscussionNotes,
        outcome: obsOutcome,
        overallNotes: obsOverallNotes,
        ratings: obsRatings
      });
      setSuccess("Team observation and overlap discussion recorded successfully.");
      setShowObservationForm(false);
      setObsDiscussionNotes("");
      setObsOutcome("");
      setObsOverallNotes("");
      setObsCandidateIds([]);
    } catch (err: any) {
      setError(err.message || "Failed to record team observation");
    } finally {
      setLoading(false);
    }
  };

  const lockedCount = candidates.filter(c => c.assignments.length >= 1 && c.assignments.every((a: any) => a.isLocked)).length;
  const pendingLockCount = candidates.filter(c => c.assignments.length >= 1 && c.assignments.some((a: any) => !a.isLocked)).length;
  const unassignedCount = candidates.filter(c => c.assignments.length === 0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
              CAPABILITY MATRIX
            </span>
            <span className="text-xs text-slate-400 font-medium">6 Areas • 12 Total Slots</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Candidate Capability Area Allocation
          </h1>
          <p className="text-xs text-slate-400">
            Map candidates to 1–2 capability areas based on physical selection meeting consensus.
          </p>
        </div>

        <button
          onClick={() => setConfirmLockModal({ open: true, isBulk: true })}
          disabled={loading || pendingLockCount === 0}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/30 flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:cursor-not-allowed"
        >
          <Lock size={14} />
          <span>Lock All Valid ({pendingLockCount})</span>
        </button>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Readiness KPI Status Strip */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Readiness Overview</span>
            <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <span>{lockedCount} / 7 Ready</span>
              {lockedCount === 7 && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                  All Sealed
                </span>
              )}
            </div>
          </div>

          <div className="h-7 w-px bg-white/[0.08] hidden sm:block" />

          <div className="flex gap-3">
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-medium">Locked</span>
              <span className="text-xs font-bold text-emerald-400">{lockedCount}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-medium">Pending Lock</span>
              <span className="text-xs font-bold text-amber-400">{pendingLockCount}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#060813] border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 block font-medium">Unassigned</span>
              <span className="text-xs font-bold text-slate-300">{unassignedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Capability Area Capacity Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-violet-400" />
            <span>Capability Area Capacity (Max 2 Candidates per Area)</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">12 Total Capacity Slots</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area) => {
            const count = area.assignments?.length || 0;
            const isFull = count >= 2;

            return (
              <div
                key={area.id}
                className={`bg-[#0b1021] border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 transition-all ${
                  isFull ? "border-amber-500/30" : "border-white/[0.08] hover:border-white/[0.14]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{area.name}</h3>
                      <span className="text-[10px] bg-violet-600/15 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded font-mono inline-block mt-1">
                        Role: {area.hiddenRole}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isFull
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : count === 1
                          ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                          : "bg-[#060813] text-slate-500 border-white/[0.06]"
                      }`}
                    >
                      {isFull ? "FULL (2/2)" : `${count} / 2`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {area.description}
                  </p>
                </div>

                {/* Assigned Candidates Chips */}
                <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Candidates</span>
                  {count === 0 ? (
                    <span className="text-xs text-slate-600 italic">No candidates assigned yet</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {area.assignments.map((a: any) => (
                        <span
                          key={a.id}
                          className="text-xs bg-[#060813] border border-white/[0.08] text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          <span className="font-medium text-[11px]">{a.candidate.user.name}</span>
                          {a.isLocked && <Lock size={10} className="text-emerald-400" />}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Allocation Matrix Card */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl shadow-xl p-5 sm:p-6 space-y-5">
        <div className="border-b border-white/[0.08] pb-4">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users size={16} className="text-violet-400" />
            <span>Candidate Capability Assignment Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Assign 1 to 2 capability areas per candidate. Lock assignments once verified.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {candidates.map((candidate) => {
            const isLocked = candidate.assignments.length > 0 && candidate.assignments.every((a: any) => a.isLocked);
            const assignmentCount = candidate.assignments.length;
            const canLock = assignmentCount >= 1 && assignmentCount <= 2 && !isLocked;

            return (
              <div
                key={candidate.id}
                className="p-4 sm:p-5 rounded-xl border border-white/[0.06] bg-[#060813] hover:border-white/[0.1] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Candidate Bio */}
                <div className="min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{candidate.user.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      {candidate.secId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {candidate.department} {candidate.section ? `• Sec ${candidate.section}` : ""} • {candidate.year}
                  </p>
                </div>

                {/* Current Assignments Display */}
                <div className="flex-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium mr-1">
                    Assigned ({assignmentCount}/2):
                  </span>

                  {assignmentCount === 0 ? (
                    <span className="text-xs text-slate-500 italic">No areas assigned</span>
                  ) : (
                    candidate.assignments.map((a: any) => (
                      <div
                        key={a.id}
                        className="flex items-center bg-violet-600/15 border border-violet-500/25 text-violet-300 text-xs px-2.5 py-1 rounded-lg"
                      >
                        <span className="font-medium text-slate-200 mr-2 text-[11px]">{a.area.name}</span>
                        {!isLocked ? (
                          <button
                            onClick={() => handleRemove(a.id)}
                            disabled={loading}
                            className="text-slate-400 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                            title="Remove assignment"
                          >
                            <X size={12} />
                          </button>
                        ) : (
                          <Lock size={10} className="text-emerald-400" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Actions: Add Area & Lock / Unlock */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
                  {!isLocked && assignmentCount < 2 && (
                    <select
                      disabled={loading}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssign(candidate.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      defaultValue=""
                      className="bg-[#0b1021] border border-white/[0.08] text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    >
                      <option value="" disabled>
                        + Assign Area ({assignmentCount + 1}/2)
                      </option>
                      {areas.map((area) => {
                        const isAssigned = candidate.assignments.some((a: any) => a.capabilityAreaId === area.id);
                        const isFull = (area.assignments?.length || 0) >= 2;
                        if (isAssigned) return null;

                        return (
                          <option key={area.id} value={area.id} disabled={isFull}>
                            {area.name} {isFull ? "(Full 2/2)" : `(${area.assignments?.length || 0}/2)`}
                          </option>
                        );
                      })}
                    </select>
                  )}

                  {isLocked ? (
                    <button
                      onClick={() => setConfirmUnlockModal({ open: true, candidateId: candidate.id, candidateName: candidate.user.name })}
                      disabled={loading}
                      className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlock size={13} />
                      <span>Unlock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmLockModal({ open: true, candidateId: candidate.id, candidateName: candidate.user.name })}
                      disabled={loading || !canLock}
                      className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-violet-900/30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Lock size={13} />
                      <span>Lock ({assignmentCount}/2)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overlap & Team Observation Drawer */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl shadow-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-violet-400" />
              <span>Physical Meeting Overlap Discussions & Team Observations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Record qualitative teamwork ratings and discussion outcomes during selection consensus.
            </p>
          </div>

          <button
            onClick={() => setShowObservationForm(!showObservationForm)}
            className="bg-[#060813] hover:bg-slate-900 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-white/[0.08] transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
          >
            {showObservationForm ? <ChevronUp size={14} /> : <Plus size={14} />}
            <span>{showObservationForm ? "Close Form" : "Record Observation"}</span>
          </button>
        </div>

        {/* Observation Form */}
        {showObservationForm && (
          <form onSubmit={handleSaveObservation} className="bg-[#060813] border border-white/[0.08] p-5 sm:p-6 rounded-2xl space-y-5 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span>Record Team Discussion Observation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Capability Area</label>
                <select
                  value={obsAreaId}
                  onChange={(e) => setObsAreaId(e.target.value)}
                  className="w-full bg-[#0b1021] border border-white/[0.08] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Role: {a.hiddenRole})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Overlap Resolution Status</label>
                <select
                  value={obsOverlapStatus}
                  onChange={(e) => setObsOverlapStatus(e.target.value)}
                  className="w-full bg-[#0b1021] border border-white/[0.08] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  <option value="NO_OVERLAP">No Overlap (Direct Agreement)</option>
                  <option value="DISCUSSED">Overlap Discussed (Under physical negotiation)</option>
                  <option value="RESOLVED">Resolved (Final consensus reached)</option>
                </select>
              </div>
            </div>

            {/* Candidate Participants Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Participating Candidates in Discussion</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {candidates.map((c) => {
                  const isSelected = obsCandidateIds.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => {
                        if (isSelected) {
                          setObsCandidateIds(obsCandidateIds.filter(id => id !== c.id));
                        } else {
                          setObsCandidateIds([...obsCandidateIds, c.id]);
                        }
                      }}
                      className={`p-2.5 text-xs rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-violet-600/20 border-violet-500 text-white font-semibold"
                          : "bg-[#0b1021] border-white/[0.06] text-slate-400 hover:border-white/[0.14]"
                      }`}
                    >
                      <span className="truncate">{c.user.name}</span>
                      {isSelected && <CheckCircle2 size={13} className="text-violet-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qualitative Ratings Grid */}
            <div className="space-y-2 border-t border-white/[0.06] pt-4">
              <label className="text-xs font-bold text-slate-200 block">Teamwork & Leadership Ratings (1 - 10)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "teamwork", label: "Teamwork" },
                  { key: "communication", label: "Communication" },
                  { key: "listening", label: "Listening" },
                  { key: "negotiation", label: "Negotiation" },
                  { key: "leadership", label: "Leadership" },
                  { key: "respect", label: "Respect" },
                  { key: "adaptability", label: "Adaptability" },
                  { key: "teamFirst", label: "Team-First Attitude" }
                ].map((dim) => (
                  <div key={dim.key} className="bg-[#0b1021] p-3 rounded-xl border border-white/[0.06]">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{dim.label}</span>
                      <span className="text-violet-400 font-bold font-mono">{(obsRatings as any)[dim.key]}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={(obsRatings as any)[dim.key]}
                      onChange={(e) =>
                        setObsRatings({
                          ...obsRatings,
                          [dim.key]: parseInt(e.target.value)
                        })
                      }
                      className="w-full h-1.5 bg-[#060813] rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion & Outcome Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Discussion Notes & Observations</label>
                <textarea
                  value={obsDiscussionNotes}
                  onChange={(e) => setObsDiscussionNotes(e.target.value)}
                  placeholder="How did candidates negotiate? What arguments were made?"
                  className="w-full h-20 bg-[#0b1021] border border-white/[0.08] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Outcome & Consensus Reached</label>
                <textarea
                  value={obsOutcome}
                  onChange={(e) => setObsOutcome(e.target.value)}
                  placeholder="What was the final agreed resolution?"
                  className="w-full h-20 bg-[#0b1021] border border-white/[0.08] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowObservationForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-violet-900/30 cursor-pointer"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : null}
                <span>Save Observation Record</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Observations List */}
        <div className="space-y-2.5">
          {observations.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs italic bg-[#060813] rounded-xl border border-white/[0.06]">
              No overlap discussion observations recorded yet.
            </div>
          ) : (
            observations.map((obs) => (
              <div key={obs.id} className="bg-[#060813] border border-white/[0.06] rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{obs.area.name}</span>
                    <span className="text-[10px] bg-violet-600/15 text-violet-300 px-2 py-0.5 rounded border border-violet-500/20 font-medium">
                      {obs.overlapStatus}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {new Date(obs.observedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="text-slate-500 text-[11px]">Participants:</span>
                  {obs.participants.map((p: any) => (
                    <span key={p.id} className="bg-[#0b1021] border border-white/[0.06] px-2 py-0.5 rounded text-slate-300 text-[11px] font-medium">
                      {p.candidate.user.name}
                    </span>
                  ))}
                </div>

                {obs.notes && (
                  <p className="text-xs text-slate-300 bg-[#0b1021] p-2.5 rounded-xl border border-white/[0.06] leading-relaxed">
                    {obs.notes}
                  </p>
                )}

                {obs.outcome && (
                  <div className="text-xs text-emerald-400 font-medium">
                    <strong>Outcome:</strong> {obs.outcome}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Lock */}
      {confirmLockModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-emerald-400">
              <Lock size={20} />
              <h3 className="text-base font-bold text-white">
                {confirmLockModal.isBulk ? "Lock All Capability Assignments?" : `Lock ${confirmLockModal.candidateName}'s Assignments?`}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmLockModal.isBulk
                ? "This will lock all candidate assignments that have at least 1 and at most 2 areas assigned. Assignments become official and read-only."
                : `Are you sure you want to lock assignments for ${confirmLockModal.candidateName}? This candidate will be marked READY_FOR_ASSESSMENT.`}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmLockModal({ open: false })}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmLockModal.isBulk) {
                    handleBulkLock();
                  } else if (confirmLockModal.candidateId) {
                    handleLockCandidate(confirmLockModal.candidateId);
                  }
                }}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                <span>Confirm Lock</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Unlock */}
      {confirmUnlockModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-400">
              <Unlock size={20} />
              <h3 className="text-base font-bold text-white">
                Unlock {confirmUnlockModal.candidateName}&apos;s Assignment?
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unlocking will allow capability areas to be added, removed, or modified. This action will be audited.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmUnlockModal({ open: false })}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmUnlockModal.candidateId) {
                    handleUnlockCandidate(confirmUnlockModal.candidateId);
                  }
                }}
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
