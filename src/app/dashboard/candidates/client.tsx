"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, Lock, Unlock, Eye, Users, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

type Props = {
  candidates: any[];
};

export function CandidatesClient({ candidates }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"name" | "secId" | "department">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => {
        const name = candidate.user.name?.toLowerCase() || "";
        const secId = candidate.secId.toLowerCase();
        const dept = candidate.department.toLowerCase();
        const query = search.toLowerCase();

        const matchesSearch = name.includes(query) || secId.includes(query) || dept.includes(query);

        const isLocked = candidate.assignments.length > 0 && candidate.assignments.every((a: any) => a.isLocked);
        const hasAssignments = candidate.assignments.length > 0;

        let matchesStatus = true;
        if (statusFilter === "READY") {
          matchesStatus = isLocked;
        } else if (statusFilter === "PENDING") {
          matchesStatus = hasAssignments && !isLocked;
        } else if (statusFilter === "UNASSIGNED") {
          matchesStatus = !hasAssignments;
        }

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = "";
        let valB = "";
        if (sortBy === "name") {
          valA = a.user.name || "";
          valB = b.user.name || "";
        } else if (sortBy === "secId") {
          valA = a.secId;
          valB = b.secId;
        } else if (sortBy === "department") {
          valA = a.department;
          valB = b.department;
        }

        const comp = valA.localeCompare(valB);
        return sortOrder === "asc" ? comp : -comp;
      });
  }, [candidates, search, statusFilter, sortBy, sortOrder]);

  const toggleSort = (column: "name" | "secId" | "department") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
              CANDIDATE ROSTER
            </span>
            <span className="text-xs text-slate-400 font-medium">7 Candidates</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Candidate Profiles & Management
          </h1>
          <p className="text-xs text-slate-400">
            Inspect individual student profiles, allocated capability areas, and assessment progress.
          </p>
        </div>

        <Link
          href="/dashboard/allocation"
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShieldCheck size={15} />
          <span>Capability Matrix</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, SEC ID..."
            className="w-full bg-[#060813] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/80 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#060813] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              <option value="ALL">All Statuses ({candidates.length})</option>
              <option value="READY">Ready for Assessment (Locked)</option>
              <option value="PENDING">Pending Lock</option>
              <option value="UNASSIGNED">Unassigned (0 Areas)</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {filteredCandidates.length} of {candidates.length}
          </span>
        </div>
      </div>

      {/* Candidate Table Card */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#060813]/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th
                  onClick={() => toggleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Candidate</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("secId")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>SEC ID</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("department")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department & Year</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-3 px-4">Allocated Areas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No candidates match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const isLocked =
                    candidate.assignments.length > 0 &&
                    candidate.assignments.every((a: any) => a.isLocked);
                  const hasAssignments = candidate.assignments.length > 0;

                  return (
                    <tr key={candidate.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {candidate.user.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {candidate.secId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <span>{candidate.department}</span>
                        <span className="text-slate-500 ml-1.5">({candidate.year})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {!hasAssignments ? (
                            <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                          ) : (
                            candidate.assignments.map((assignment: any) => (
                              <span
                                key={assignment.id}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-600/15 text-violet-300 border border-violet-500/20"
                              >
                                {assignment.area.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Lock size={10} /> Locked & Ready
                          </span>
                        ) : hasAssignments ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock size={10} /> Pending Lock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-700/40">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/dashboard/candidates/${candidate.id}`}
                          className="px-3 py-1.5 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-white/[0.08] transition-all text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>View</span>
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
