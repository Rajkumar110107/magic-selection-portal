"use client";

import { useState } from "react";
import Link from "next/link";
import {
  assignArea,
  removeArea,
  toggleLock,
  saveAdminNotes
} from "@/app/dashboard/allocation/actions";
import {
  ArrowLeft,
  Lock,
  Unlock,
  Plus,
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Loader2,
  Save,
  History,
  AlertCircle
} from "lucide-react";

type Props = {
  candidate: any;
  allAreas: any[];
  auditLogs: any[];
};

export function CandidateProfileClient({ candidate, allAreas, auditLogs }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState(candidate.adminNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const [confirmLockModal, setConfirmLockModal] = useState(false);
  const [confirmUnlockModal, setConfirmUnlockModal] = useState(false);

  const isLocked = candidate.assignments.length > 0 && candidate.assignments.every((a: any) => a.isLocked);
  const count = candidate.assignments.length;
  const canLock = count >= 1 && count <= 2 && !isLocked;

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAssign = async (areaId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await assignArea(candidate.id, areaId);
      setSuccess("Capability area assigned.");
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
      setSuccess("Assignment removed.");
    } catch (err: any) {
      setError(err.message || "Failed to remove area");
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async () => {
    try {
      setLoading(true);
      clearMessages();
      await toggleLock(candidate.id, true);
      setSuccess("Candidate assignments locked.");
      setConfirmLockModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to lock assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    try {
      setLoading(true);
      clearMessages();
      await toggleLock(candidate.id, false);
      setSuccess("Candidate assignments unlocked.");
      setConfirmUnlockModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to unlock assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      clearMessages();
      await saveAdminNotes(candidate.id, adminNotes);
      setSuccess("Admin notes saved successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/dashboard/candidates"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 mb-3 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Candidate Roster</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{candidate.user.name}</h1>
              <span className="font-mono text-xs bg-[#060813] text-slate-300 border border-white/[0.08] px-2.5 py-0.5 rounded-md">
                {candidate.secId}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              {candidate.department} {candidate.section ? `• Section ${candidate.section}` : ""} • {candidate.year}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {isLocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock size={13} />
                <span>ASSIGNMENT LOCKED</span>
              </span>
            ) : count >= 1 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Unlock size={13} />
                <span>PENDING LOCK ({count}/2)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-400 border border-slate-700">
                <span>UNASSIGNED</span>
              </span>
            )}
          </div>
        </div>
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

      {/* Candidate Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
            Student Identification
          </span>
          <div className="text-sm font-bold text-slate-100 font-mono">{candidate.secId}</div>
          <div className="text-xs text-slate-400 truncate">{candidate.user.email}</div>
        </div>

        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
            Department & Academic Year
          </span>
          <div className="text-sm font-bold text-slate-100">{candidate.department}</div>
          <div className="text-xs text-slate-400">
            {candidate.year} {candidate.section ? `• Sec ${candidate.section}` : ""}
          </div>
        </div>

        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
            Assessment Status
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
            {isLocked ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> READY FOR ASSESSMENT
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Clock size={14} /> PENDING ROLE LOCK
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500">
            {isLocked ? "Assignments locked." : "Awaiting physical consensus."}
          </div>
        </div>
      </div>

      {/* Assigned Capability Areas Management */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Shield size={16} className="text-violet-400" />
              <span>Assigned Capability Areas ({count} / 2)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Minimum 1 area, maximum 2 areas. Assignments must be locked to enable assessment readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isLocked ? (
              <button
                onClick={() => setConfirmUnlockModal(true)}
                disabled={loading}
                className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock size={13} />
                <span>Unlock Assignments</span>
              </button>
            ) : (
              <button
                onClick={() => setConfirmLockModal(true)}
                disabled={loading || !canLock}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-violet-900/30 cursor-pointer disabled:cursor-not-allowed"
              >
                <Lock size={13} />
                <span>Lock Candidate Assignments</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Area List */}
        <div className="space-y-2.5">
          {count === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs italic bg-[#060813] rounded-xl border border-white/[0.06]">
              No capability areas assigned to this candidate yet.
            </div>
          ) : (
            candidate.assignments.map((a: any) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#060813] border border-white/[0.06]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-100">{a.area.name}</h3>
                    <span className="text-[10px] bg-violet-600/15 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded font-mono">
                      Role: {a.area.hiddenRole}
                    </span>
                    {a.isLocked && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned on {new Date(a.assignedAt).toLocaleDateString()}
                    {a.lockedAt && ` • Locked on ${new Date(a.lockedAt).toLocaleDateString()}`}
                  </p>
                </div>

                {!isLocked && (
                  <button
                    onClick={() => handleRemove(a.id)}
                    disabled={loading}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove Area"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Area Controls (if unlocked and < 2) */}
        {!isLocked && count < 2 && (
          <div className="p-4 bg-[#060813] border border-white/[0.06] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-300 block">Add Capability Area ({count + 1}/2)</span>
              <span className="text-[11px] text-slate-500">Select an available capability area with open capacity</span>
            </div>

            <select
              disabled={loading}
              onChange={(e) => {
                if (e.target.value) {
                  handleAssign(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="bg-[#0b1021] border border-white/[0.08] text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/40 w-full sm:w-auto"
            >
              <option value="" disabled>
                Choose Capability Area...
              </option>
              {allAreas.map((area) => {
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
          </div>
        )}
      </div>

      {/* Admin Notes Section */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText size={16} className="text-violet-400" />
            <span>Administrator Notes</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Private internal observations</span>
        </div>

        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Record notes on candidate performance, communication style, or preferences..."
          className="w-full h-28 bg-[#060813] border border-white/[0.08] rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-violet-900/30 cursor-pointer"
          >
            {savingNotes ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save Notes</span>
          </button>
        </div>
      </div>

      {/* Audit Log for this Candidate */}
      {auditLogs.length > 0 && (
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <History size={15} className="text-violet-400" />
            <span>Candidate Activity Log</span>
          </h2>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#060813] rounded-xl border border-white/[0.06] text-xs flex justify-between items-center">
                <span className="font-mono text-slate-300 font-semibold">{log.action}</span>
                <span className="text-slate-500 text-[11px] font-mono">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Lock */}
      {confirmLockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-emerald-400">
              <Lock size={20} />
              <h3 className="text-base font-bold text-white">Lock Assignments for {candidate.user.name}?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Locking will mark this candidate as <strong>READY_FOR_ASSESSMENT</strong> and make their capability areas read-only.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmLockModal(false)}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLock}
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
      {confirmUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-400">
              <Unlock size={20} />
              <h3 className="text-base font-bold text-white">Unlock Assignments?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unlocking will permit modifications to assigned areas. This action will be audited.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmUnlockModal(false)}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
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
