"use client";

import { useState } from "react";
import { saveEvaluation } from "./actions";
import { Loader2, Check, AlertCircle, Sparkles, Star, Award, Shield } from "lucide-react";

interface EvaluationScoreItem {
  dimension: string;
  score: number;
}

interface EvaluationData {
  id?: string;
  totalScore: number | null;
  notes: string | null;
  scores: EvaluationScoreItem[];
}

const DEFAULT_COMPETENCIES = [
  "Critical Thinking",
  "Problem Identification",
  "Analysis & Evidence Use",
  "Prioritization & Strategy",
  "Decision Quality & Trade-offs",
  "Reasoning & Justification",
  "Adaptability under Constraint",
  "Communication & Clarity",
  "Role Fit & Leadership Potential"
];

export function EvaluationForm({ assessment }: { assessment: any }) {
  const existingEval: EvaluationData | null = assessment.evaluation;

  const [scores, setScores] = useState<EvaluationScoreItem[]>(() => {
    if (existingEval?.scores && existingEval.scores.length > 0) {
      return existingEval.scores;
    }
    return DEFAULT_COMPETENCIES.map((dim) => ({ dimension: dim, score: 7 }));
  });

  const [notes, setNotes] = useState(existingEval?.notes || "");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const averageScore =
    scores.reduce((sum, s) => sum + s.score, 0) / (scores.length || 1);

  const handleScoreChange = (index: number, newScore: number) => {
    const newScores = [...scores];
    newScores[index] = { ...newScores[index], score: newScore };
    setScores(newScores);
  };

  const handleSave = async (isFinal: boolean) => {
    try {
      setLoading(true);
      setSaveStatus("idle");
      const res = await saveEvaluation(assessment.id, scores, notes, isFinal);
      if (res.success) {
        setSaveStatus("success");
        setStatusMessage(isFinal ? "Evaluation marked as Finalized!" : "Draft evaluation saved.");
        setTimeout(() => setSaveStatus("idle"), 4000);
      }
    } catch (e: any) {
      setSaveStatus("error");
      setStatusMessage(e.message || "Failed to save evaluation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl shadow-xl sticky top-24 overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.08] bg-[#060813]/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award size={16} className="text-violet-400" />
          <h3 className="font-bold text-white text-sm">
            Leadership Evaluation Rubric
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 bg-violet-600/15 text-violet-300 border border-violet-500/25 px-2.5 py-1 rounded-xl">
          <Star size={11} className="fill-violet-400 text-violet-400" />
          <span className="font-mono font-bold text-xs">
            {averageScore.toFixed(1)} / 10
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 text-xs">
        {/* Competencies Scoring Sliders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              9 Core Dimensions (1–10)
            </span>
            <span className="text-[10px] text-slate-500">Slide to score</span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {scores.map((s, idx) => (
              <div
                key={s.dimension}
                className="bg-[#060813] border border-white/[0.06] p-3 rounded-xl space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-200 font-medium">{s.dimension}</label>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    s.score >= 8
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : s.score >= 5
                      ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                  }`}>
                    {s.score} / 10
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-600 font-mono">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={s.score}
                    onChange={(e) => handleScoreChange(idx, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <span className="text-[10px] text-slate-600 font-mono">10</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Written Notes */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px]">
            Qualitative Evaluator Observations
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-24 bg-[#060813] border border-white/[0.08] focus:border-violet-500/80 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none leading-relaxed"
            placeholder="Document key reasoning strengths, depth of trade-off analysis, potential blindspots..."
          />
        </div>

        {/* Human Governance Disclaimer */}
        <div className="bg-[#060813] border border-white/[0.06] p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
          <strong className="text-slate-300 flex items-center gap-1">
            <Shield size={12} className="text-violet-400" />
            Human-Led Selection Governance:
          </strong>
          <p className="leading-relaxed text-slate-500 text-[10px]">
            Scores serve as qualitative evidence during committee deliberation. The system does NOT automate candidate allocation.
          </p>
        </div>

        {/* Status Messages */}
        {saveStatus === "success" && (
          <div className="text-emerald-400 text-xs flex items-center bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl animate-in fade-in">
            <Check size={14} className="mr-2 text-emerald-400 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        {saveStatus === "error" && (
          <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-1 border-t border-white/[0.08]">
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex-1 bg-[#060813] hover:bg-slate-900 text-slate-300 py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
          >
            {loading ? <Loader2 size={13} className="animate-spin mx-auto" /> : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-900/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <>
                <Check size={13} />
                <span>Finalize Score</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
