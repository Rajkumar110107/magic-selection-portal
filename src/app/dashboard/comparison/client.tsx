"use client";

import { useState } from "react";
import {
  GitCompare,
  Users,
  Shield,
  Star,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  HelpCircle,
  FileText
} from "lucide-react";

interface EvaluationScoreData {
  dimension: string;
  score: number;
}

interface EvaluationData {
  id: string;
  totalScore: number | null;
  notes: string | null;
  evaluatedAt: Date | string;
  scores: EvaluationScoreData[];
}

interface QuestionData {
  id: string;
  orderNumber: number;
  questionText: string;
  newInformation?: string | null;
}

interface ResponseData {
  id: string;
  questionId: string;
  answerText: string;
}

interface AssessmentData {
  id: string;
  status: string;
  startedAt: Date | string | null;
  completedAt: Date | string | null;
  caseStudy: {
    code?: string | null;
    title: string;
    area: {
      id: string;
      name: string;
    };
    questions: QuestionData[];
  };
  evaluation: EvaluationData | null;
  responses: ResponseData[];
}

interface TeamObservationData {
  id: string;
  teamworkRating: number | null;
  communicationRating: number | null;
  listeningRating: number | null;
  leadershipRating: number | null;
  respectRating: number | null;
  adaptabilityRating: number | null;
  teamFirstRating: number | null;
  notes: string | null;
  overallNotes: string | null;
  observedAt: Date | string;
  area: {
    name: string;
  };
}

interface CandidateItem {
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
    isLocked: boolean;
    area: {
      id: string;
      name: string;
      hiddenRole: string;
    };
  }[];
  assessments: AssessmentData[];
  teamObservations: {
    observation: TeamObservationData;
  }[];
}

interface CapabilityAreaItem {
  id: string;
  name: string;
  hiddenRole: string;
  assignments: {
    candidate: {
      id: string;
      secId: string;
      user: { name: string | null };
    };
  }[];
  teamObservations: {
    id: string;
    notes: string | null;
    participants: {
      candidate: {
        id: string;
        secId: string;
        user: { name: string | null };
      };
    }[];
  }[];
}

export function ComparisonClient({
  candidates,
  capabilityAreas,
}: {
  candidates: CandidateItem[];
  capabilityAreas: CapabilityAreaItem[];
}) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    capabilityAreas[0]?.id || "ALL"
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(() => {
    const firstArea = capabilityAreas[0];
    if (firstArea && firstArea.assignments.length > 0) {
      return firstArea.assignments.map((a) => a.candidate.id).slice(0, 3);
    }
    return candidates.slice(0, 2).map((c) => c.id);
  });

  const [expandedResponses, setExpandedResponses] = useState<boolean>(false);

  const displayedCandidates = candidates.filter((c) =>
    selectedCandidateIds.includes(c.id)
  );

  const handleAreaFilterChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    if (areaId === "ALL") {
      setSelectedCandidateIds(candidates.slice(0, 2).map((c) => c.id));
    } else {
      const area = capabilityAreas.find((a) => a.id === areaId);
      if (area && area.assignments.length > 0) {
        setSelectedCandidateIds(area.assignments.map((a) => a.candidate.id));
      } else {
        setSelectedCandidateIds([]);
      }
    }
  };

  const toggleCandidateSelection = (candidateId: string) => {
    if (selectedCandidateIds.includes(candidateId)) {
      if (selectedCandidateIds.length > 1) {
        setSelectedCandidateIds(selectedCandidateIds.filter((id) => id !== candidateId));
      }
    } else {
      if (selectedCandidateIds.length < 3) {
        setSelectedCandidateIds([...selectedCandidateIds, candidateId]);
      } else {
        setSelectedCandidateIds([selectedCandidateIds[1], selectedCandidateIds[2], candidateId]);
      }
    }
  };

  const selectedArea = capabilityAreas.find((a) => a.id === selectedAreaId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
              COMPARATIVE ANALYSIS
            </span>
            <span className="text-xs text-slate-400 font-medium">Side-by-Side Deliberation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Candidate Leadership Comparison
          </h1>
          <p className="text-xs text-slate-400">
            Side-by-side evidence analysis: case scores, qualitative notes, original answers, and meeting ratings.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 bg-[#0b1021] border border-white/[0.08] px-3 py-1.5 rounded-xl text-slate-300 text-xs font-semibold">
            <Shield size={13} className="text-violet-400" />
            <span>Human Decision Support</span>
          </div>
        </div>
      </div>

      {/* Area Selection Pills */}
      <div className="bg-[#0b1021] border border-white/[0.08] p-5 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Filter by Capability Area (Overlapping Candidates)
          </span>
          {selectedArea && (
            <span className="text-xs text-slate-400">
              Target Role: <strong className="text-violet-300">{selectedArea.hiddenRole}</strong>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {capabilityAreas.map((area) => {
            const isSelected = selectedAreaId === area.id;
            const assignedCount = area.assignments.length;

            return (
              <button
                key={area.id}
                onClick={() => handleAreaFilterChange(area.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? "bg-violet-600 text-white border-violet-500 shadow-sm shadow-violet-900/40"
                    : "bg-[#060813] border-white/[0.06] text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{area.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-900 text-slate-500"
                  }`}
                >
                  {assignedCount}/2
                </span>
              </button>
            );
          })}
        </div>

        {/* Candidate Checklist */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Select Candidates to Compare:</span>
          {candidates.map((c) => {
            const isSelected = selectedCandidateIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidateSelection(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-violet-600/15 border-violet-500/30 text-violet-300 font-semibold"
                    : "bg-[#060813] border-white/[0.06] text-slate-500 hover:text-slate-300"
                }`}
              >
                {c.user.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Columns Grid */}
      <div className={`grid grid-cols-1 ${displayedCandidates.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4`}>
        {displayedCandidates.map((candidate) => {
          const matchingAssessment = candidate.assessments.find(
            (ass) => ass.caseStudy.area.id === selectedAreaId
          );
          const evaluation = matchingAssessment?.evaluation;
          const scores = evaluation?.scores || [];

          return (
            <div
              key={candidate.id}
              className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Candidate Header */}
                <div className="border-b border-white/[0.08] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 bg-[#060813] px-2 py-0.5 rounded border border-white/[0.06]">
                      {candidate.secId}
                    </span>
                    {evaluation?.totalScore && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Star size={11} className="fill-emerald-400" />
                        {evaluation.totalScore.toFixed(1)} / 10
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {candidate.user.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {candidate.department} • {candidate.year}
                  </p>
                </div>

                {/* Case Study Context */}
                {matchingAssessment && (
                  <div className="bg-[#060813] p-3 rounded-xl border border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                      Case Study
                    </span>
                    <p className="text-xs font-medium text-slate-200">
                      {matchingAssessment.caseStudy.title}
                    </p>
                  </div>
                )}

                {/* 9 Dimensions Breakdown */}
                {scores.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Competency Breakdown
                    </span>
                    <div className="space-y-1.5">
                      {scores.map((s) => (
                        <div key={s.dimension} className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">{s.dimension}</span>
                            <span className="font-mono font-bold text-slate-200">{s.score}/10</span>
                          </div>
                          <div className="w-full bg-[#060813] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-violet-500 h-full rounded-full"
                              style={{ width: `${(s.score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-xs italic bg-[#060813] rounded-xl border border-white/[0.06]">
                    No rubric evaluation recorded yet.
                  </div>
                )}

                {/* Qualitative Notes */}
                {evaluation?.notes && (
                  <div className="bg-[#060813] p-3 rounded-xl border border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                      Evaluator Observations
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &quot;{evaluation.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
