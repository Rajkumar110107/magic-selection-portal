"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Users,
  HelpCircle,
  Sparkles,
  Layers,
  Search,
  X,
  ChevronRight,
  Shield,
  Clock,
  Tag,
  Eye
} from "lucide-react";

interface QuestionData {
  id: string;
  orderNumber: number;
  questionText: string;
  newInformation: string | null;
  competencyTested: string | null;
  guidance: string | null;
}

interface CandidateData {
  id: string;
  secId: string;
  department: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface AssessmentData {
  id: string;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  candidate: CandidateData;
}

interface CaseStudyItem {
  id: string;
  capabilityAreaId: string;
  code: string | null;
  title: string;
  shortDescription: string | null;
  background: string | null;
  currentSituation: string | null;
  stakeholders: string | null;
  knownInformation: string | null;
  constraints: string | null;
  hiddenDetails: string | null;
  initialChallenge: string | null;
  finalDecisionChallenge: string | null;
  assessmentCompetencies: string | null;
  difficultyLevel: string;
  version: number;
  isActive: boolean;
  context: string;
  areaName?: string;
  hiddenRole?: string;
  questions: QuestionData[];
  assessments: AssessmentData[];
}

interface CapabilityAreaItem {
  id: string;
  name: string;
  hiddenRole: string;
  description: string | null;
  caseStudies: CaseStudyItem[];
}

interface CaseStudiesClientProps {
  capabilityAreas: CapabilityAreaItem[];
  totalCases: number;
  totalQuestions: number;
  totalAssignments: number;
}

export function CaseStudiesClient({
  capabilityAreas,
  totalCases,
  totalQuestions,
  totalAssignments,
}: CaseStudiesClientProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalCase, setActiveModalCase] = useState<(CaseStudyItem & { areaName?: string; hiddenRole?: string }) | null>(null);

  // Flatten all cases for search and filter
  const allCases: (CaseStudyItem & { areaName: string; hiddenRole: string })[] = [];
  capabilityAreas.forEach((area) => {
    area.caseStudies.forEach((cs) => {
      allCases.push({
        ...cs,
        areaName: area.name,
        hiddenRole: area.hiddenRole,
      });
    });
  });

  const filteredCases = allCases.filter((cs) => {
    const matchesArea =
      selectedAreaId === "ALL" || cs.capabilityAreaId === selectedAreaId;
    const matchesSearch =
      searchQuery.trim() === "" ||
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cs.code && cs.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cs.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cs.shortDescription &&
        cs.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesArea && matchesSearch;
  });

  const isBankComplete = totalCases === 18 && capabilityAreas.length === 6;

  const parseJsonList = (jsonStr: string | null): string[] => {
    if (!jsonStr) return [];
    try {
      return JSON.parse(jsonStr);
    } catch {
      return [jsonStr];
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2.5 py-0.5 rounded-md border border-violet-500/25">
              CASE ENGINE
            </span>
            <span className="text-xs text-slate-400 font-medium">18 Leadership Scenarios</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Leadership Case Study Bank
          </h1>
          <p className="text-xs text-slate-400">
            18 full-length leadership cases with real stakeholders, constraints, progressive twists, and 180 questions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isBankComplete ? (
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
              <CheckCircle2 size={14} />
              <span>18 / 18 Bank Complete (6 × 3)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-400 text-xs font-semibold">
              <AlertTriangle size={14} />
              <span>{totalCases} / 18 Cases Configured</span>
            </div>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Case Bank</span>
            <div className="p-2 rounded-xl bg-[#060813] border border-white/[0.06] text-violet-400">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">{totalCases}</div>
          <p className="text-[11px] text-slate-500">3 cases per 6 capability areas</p>
        </div>

        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Questions</span>
            <div className="p-2 rounded-xl bg-[#060813] border border-white/[0.06] text-indigo-400">
              <HelpCircle size={18} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">{totalQuestions}</div>
          <p className="text-[11px] text-slate-500">10 sequential questions per case</p>
        </div>

        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Capability Areas</span>
            <div className="p-2 rounded-xl bg-[#060813] border border-white/[0.06] text-emerald-400">
              <Shield size={18} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">{capabilityAreas.length} / 6</div>
          <p className="text-[11px] text-slate-500">All mapped to hidden MAGIC roles</p>
        </div>

        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Active Allocations</span>
            <div className="p-2 rounded-xl bg-[#060813] border border-white/[0.06] text-amber-400">
              <Users size={18} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">{totalAssignments}</div>
          <p className="text-[11px] text-slate-500">Fair-balanced random assignment</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case code, title, area..."
              className="w-full bg-[#060813] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <span className="text-xs text-slate-500 font-mono self-end sm:self-auto">
            Showing {filteredCases.length} of {totalCases} Cases
          </span>
        </div>

        {/* Capability Area Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedAreaId("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedAreaId === "ALL"
                ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
                : "bg-[#060813] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
            }`}
          >
            All Areas ({totalCases})
          </button>
          {capabilityAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedAreaId === area.id
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
                  : "bg-[#060813] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
              }`}
            >
              {area.name} ({area.caseStudies.length})
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((cs) => {
          const stakeholders = parseJsonList(cs.stakeholders);
          const constraints = parseJsonList(cs.constraints);
          const twistQuestion = cs.questions.find((q) => q.newInformation);

          return (
            <div
              key={cs.id}
              className="bg-[#0b1021] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2 py-0.5 rounded border border-violet-500/20">
                    {cs.code || "CASE"}
                  </span>
                  <span className="text-[10px] bg-slate-900 text-slate-400 border border-white/[0.06] px-2 py-0.5 rounded font-medium">
                    {cs.areaName}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {cs.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {cs.shortDescription || cs.background || cs.context}
                </p>

                {/* Badges / Metrics */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-[#060813] border border-white/[0.06] text-slate-400 px-2 py-0.5 rounded">
                    10 Questions
                  </span>
                  {twistQuestion && (
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                      Twist at Q{twistQuestion.orderNumber}
                    </span>
                  )}
                  {stakeholders.length > 0 && (
                    <span className="text-[10px] bg-[#060813] border border-white/[0.06] text-slate-400 px-2 py-0.5 rounded">
                      {stakeholders.length} Stakeholders
                    </span>
                  )}
                </div>
              </div>

              {/* Inspect Button */}
              <div className="pt-3 border-t border-white/[0.04] flex justify-end">
                <button
                  onClick={() => setActiveModalCase(cs)}
                  className="px-3.5 py-1.5 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-white/[0.08] transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Inspect Case</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study Full Inspection Modal */}
      {activeModalCase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-600/15 px-2 py-0.5 rounded border border-violet-500/20">
                    {activeModalCase.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeModalCase.areaName} (Hidden Role: {activeModalCase.hiddenRole})
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {activeModalCase.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveModalCase(null)}
                className="p-1.5 rounded-xl bg-[#060813] border border-white/[0.08] text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Background & Situation */}
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-[#060813] p-4 rounded-xl border border-white/[0.06] space-y-1.5">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Background Context
                </h4>
                <p className="leading-relaxed">{activeModalCase.background || activeModalCase.context}</p>
              </div>

              {activeModalCase.currentSituation && (
                <div className="bg-[#060813] p-4 rounded-xl border border-white/[0.06] space-y-1.5">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Current Situation
                  </h4>
                  <p className="leading-relaxed">{activeModalCase.currentSituation}</p>
                </div>
              )}

              {/* Questions List Preview */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Questions Progression ({activeModalCase.questions.length} Questions)
                </h4>
                <div className="space-y-2">
                  {activeModalCase.questions.map((q, idx) => (
                    <div key={q.id} className="bg-[#060813] p-3 rounded-xl border border-white/[0.06] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-violet-400">Question {idx + 1}</span>
                        {q.newInformation && (
                          <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">
                            Twist Configured
                          </span>
                        )}
                      </div>
                      {q.newInformation && (
                        <div className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                          <strong>Twist:</strong> {q.newInformation}
                        </div>
                      )}
                      <p className="text-slate-200 font-medium">{q.questionText}</p>
                      {q.guidance && (
                        <p className="text-slate-500 text-[10px] italic">
                          Evaluation Guidance: {q.guidance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right border-t border-white/[0.08]">
              <button
                onClick={() => setActiveModalCase(null)}
                className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold border border-white/[0.08] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
