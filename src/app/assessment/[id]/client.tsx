"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveResponse, submitAssessment } from "./actions";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Clock,
  BookOpen,
  Send,
  Lock,
  ArrowLeft,
  Shield,
  HelpCircle,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  X
} from "lucide-react";

interface QuestionItem {
  id: string;
  orderNumber: number;
  questionText: string;
  newInformation?: string | null;
  competencyTested?: string | null;
}

interface ResponseItem {
  id?: string;
  questionId: string;
  answerText: string;
  submittedAt?: Date | string;
}

interface AssessmentData {
  id: string;
  status: string;
  startedAt: Date | string | null;
  completedAt: Date | string | null;
  candidate: {
    secId: string;
    department: string;
    year: string;
    user: {
      name: string | null;
      email: string | null;
    };
  };
  caseStudy: {
    id: string;
    code?: string | null;
    title: string;
    shortDescription?: string | null;
    background?: string | null;
    currentSituation?: string | null;
    context: string;
    area: {
      name: string;
    };
    questions: QuestionItem[];
  };
  responses: ResponseItem[];
}

export function AssessmentClient({
  assessment,
  isAdmin,
}: {
  assessment: AssessmentData;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const caseStudy = assessment.caseStudy;
  const questions = caseStudy.questions;

  const isAlreadySubmitted =
    assessment.status === "COMPLETED" ||
    assessment.status === "EVALUATED" ||
    assessment.status === "SUBMITTED";

  // Map of questionId -> answerText
  const [answersMap, setAnswersMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    assessment.responses.forEach((r) => {
      map[r.questionId] = r.answerText || "";
    });
    return map;
  });

  // Current view mode: "INTRO" | "QUESTION" | "REVIEW" | "COMPLETED"
  const [viewMode, setViewMode] = useState<"INTRO" | "QUESTION" | "REVIEW" | "COMPLETED">(() => {
    if (isAlreadySubmitted) return "COMPLETED";
    const firstUnansweredIndex = questions.findIndex(
      (q) => !assessment.responses.some((r) => r.questionId === q.id && r.answerText.trim() !== "")
    );
    if (firstUnansweredIndex === 0 && assessment.responses.length === 0) {
      return "INTRO";
    }
    return "QUESTION";
  });

  // Current question index (0 to 9)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const firstUnansweredIndex = questions.findIndex(
      (q) => !assessment.responses.some((r) => r.questionId === q.id && r.answerText.trim() !== "")
    );
    return firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex;
  });

  // Case study reference modal toggle
  const [showCaseModal, setShowCaseModal] = useState(false);

  // Saving states
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answersMap[currentQuestion.id] || "" : "";

  // Perform save action
  const performSave = useCallback(
    async (questionId: string, text: string) => {
      if (isAlreadySubmitted || isAdmin) return;
      if (!text.trim()) return;

      setSaveStatus("saving");
      setErrorMessage(null);

      try {
        const res = await saveResponse(assessment.id, questionId, text);
        if (res.success) {
          setSaveStatus("saved");
          setLastSavedTime(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          );
        }
      } catch (err: any) {
        console.error("Autosave error:", err);
        setSaveStatus("error");
        setErrorMessage(err.message || "Failed to save response. Click to retry.");
      }
    },
    [assessment.id, isAlreadySubmitted, isAdmin]
  );

  // Handle text change with debounced autosave (1200ms)
  const handleAnswerChange = (text: string) => {
    if (isAlreadySubmitted || isAdmin) return;

    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: text,
    }));
    setSaveStatus("idle");

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      performSave(currentQuestion.id, text);
    }, 1200);
  };

  // Immediate save on navigating away
  const flushCurrentSave = async () => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    if (currentQuestion && currentAnswer.trim()) {
      await performSave(currentQuestion.id, currentAnswer);
    }
  };

  const handleNext = async () => {
    await flushCurrentSave();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setViewMode("REVIEW");
    }
  };

  const handlePrevious = async () => {
    await flushCurrentSave();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = async (index: number) => {
    await flushCurrentSave();
    setCurrentQuestionIndex(index);
    setViewMode("QUESTION");
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await flushCurrentSave();
      const res = await submitAssessment(assessment.id);
      if (res.success) {
        setShowSubmitModal(false);
        setViewMode("COMPLETED");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setErrorMessage(err.message || "Failed to submit assessment. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // VIEW 1: INTRODUCTION SCREEN
  // -------------------------------------------------------------------------
  if (viewMode === "INTRO" && !isAlreadySubmitted) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
        <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-2.5">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-violet-600/15 text-violet-300 border border-violet-500/25">
              {caseStudy.code || "LEADERSHIP CASE"}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {caseStudy.area.name}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {caseStudy.title}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              {caseStudy.shortDescription || "Leadership scenario assessment testing strategic depth, decision rationale, and crisis adaptability."}
            </p>
          </div>

          {/* Scenario Overview */}
          <div className="bg-[#060813] border border-white/[0.08] rounded-xl p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} className="text-violet-400" />
              Scenario Background
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {caseStudy.background || caseStudy.context}
            </p>
          </div>

          {/* Assessment Protocol Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="bg-[#060813] border border-white/[0.06] p-3.5 rounded-xl flex items-start space-x-2.5">
              <HelpCircle size={15} className="text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">10 Progressive Questions</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Delivered sequentially. Answer with thorough leadership reasoning.
                </p>
              </div>
            </div>

            <div className="bg-[#060813] border border-white/[0.06] p-3.5 rounded-xl flex items-start space-x-2.5">
              <Sparkles size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Progressive Twists</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  New circumstances and developments will be revealed as you advance.
                </p>
              </div>
            </div>

            <div className="bg-[#060813] border border-white/[0.06] p-3.5 rounded-xl flex items-start space-x-2.5">
              <Clock size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Real-Time Autosave</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Your responses are saved continuously. You may safely resume anytime.
                </p>
              </div>
            </div>

            <div className="bg-[#060813] border border-white/[0.06] p-3.5 rounded-xl flex items-start space-x-2.5">
              <Lock size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Final Verification</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Review all answers before submission. Once submitted, responses are sealed.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Portal
            </button>

            <button
              onClick={() => setViewMode("QUESTION")}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Begin Assessment</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW 2: COMPLETED / READ-ONLY TRANSCRIPT SCREEN
  // -------------------------------------------------------------------------
  if (viewMode === "COMPLETED" || isAlreadySubmitted) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Completion Status Card */}
        <div className="bg-[#0b1021] border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/25">
            <CheckCircle2 size={28} />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Assessment Sealed & Submitted
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-2">
              {caseStudy.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Your leadership responses for <strong>{caseStudy.area.name}</strong> have been submitted for evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-1">
            {assessment.completedAt && (
              <span className="flex items-center gap-1.5 bg-[#060813] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                <Clock size={13} className="text-violet-400" />
                <span>Submitted: {new Date(assessment.completedAt).toLocaleString()}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-[#060813] px-3 py-1.5 rounded-lg border border-white/[0.08]">
              <FileCheck2 size={13} className="text-emerald-400" />
              <span>{assessment.responses.length} / {questions.length} Questions Answered</span>
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold px-5 py-2.5 rounded-xl border border-white/[0.08] transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} /> Return to Dashboard
            </button>
          </div>
        </div>

        {/* Read-Only Responses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
              <BookOpen size={16} className="text-violet-400" />
              <span>Submitted Assessment Transcript (Read-Only)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">STATUS: SEALED</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const resp = assessment.responses.find((r) => r.questionId === q.id);
              const answerText = resp?.answerText || answersMap[q.id] || "";

              return (
                <div
                  key={q.id}
                  className="bg-[#0b1021] border border-white/[0.08] rounded-xl p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-violet-400">
                      Question {idx + 1} of {questions.length}
                    </span>
                    {resp?.submittedAt && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        Saved {new Date(resp.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>

                  {q.newInformation && (
                    <div className="bg-amber-500/10 border-l-2 border-amber-500 p-3 text-amber-300 text-xs rounded-r">
                      <strong>New Circumstance Revealed:</strong> {q.newInformation}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="bg-[#060813] border border-white/[0.06] rounded-xl p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {answerText.trim() ? answerText : <span className="text-slate-600 italic">No response provided.</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW 3: REVIEW & CONFIRMATION SCREEN
  // -------------------------------------------------------------------------
  if (viewMode === "REVIEW") {
    const answeredCount = questions.filter(
      (q) => (answersMap[q.id] || "").trim() !== ""
    ).length;
    const allAnswered = answeredCount === questions.length;

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#0b1021] p-6 rounded-2xl border border-white/[0.08] shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
              Verification Prior to Final Lock
            </span>
            <h1 className="text-xl font-bold text-white mt-0.5">
              {caseStudy.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verify your answers before locking and submitting for selection board evaluation.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold border ${
                allAnswered
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {answeredCount} / {questions.length} Answered
            </span>
          </div>
        </div>

        {/* List of Questions with Edit shortcuts */}
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const ans = (answersMap[q.id] || "").trim();
            const isAnswered = ans.length > 0;

            return (
              <div
                key={q.id}
                className="bg-[#0b1021] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-violet-400">
                      Q{idx + 1}
                    </span>
                    {isAnswered ? (
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Answered ({ans.split(/\s+/).length} words)
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Incomplete
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-2">
                    {q.questionText}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                    {isAnswered ? `"${ans}"` : "No answer entered yet."}
                  </p>
                </div>

                <button
                  onClick={() => handleJumpToQuestion(idx)}
                  className="px-3 py-1.5 bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-white/[0.08] transition-all whitespace-nowrap self-start cursor-pointer"
                >
                  Edit Q{idx + 1}
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="bg-[#0b1021] border border-white/[0.08] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <button
            onClick={() => {
              setCurrentQuestionIndex(questions.length - 1);
              setViewMode("QUESTION");
            }}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft size={15} /> Back to Questions
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950/40 flex items-center gap-2 cursor-pointer"
          >
            <Send size={14} />
            <span>Finalize & Submit Assessment</span>
          </button>
        </div>

        {/* Submission Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/25">
                <AlertTriangle size={22} />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base font-bold text-white">
                  Confirm Final Assessment Submission
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you ready to submit your assessment for <strong>{caseStudy.area.name}</strong>?
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300 text-left">
                  <strong>Notice:</strong> Once confirmed, your responses will be permanently locked and submitted for evaluation.
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#060813] hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-xl border border-white/[0.08] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Confirm & Lock</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW 4: ACTIVE QUESTION-BY-QUESTION FLOW (Questions 1 to 10)
  // -------------------------------------------------------------------------
  const answeredCount = questions.filter(
    (q) => (answersMap[q.id] || "").trim() !== ""
  ).length;
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header Card: Capability, Case, and Autosave Indicator */}
      <div className="bg-[#0b1021] border border-white/[0.08] p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCaseModal(true)}
            className="px-3 py-1.5 bg-[#060813] hover:bg-slate-900 text-violet-300 text-xs font-semibold rounded-xl border border-violet-500/25 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <BookOpen size={13} />
            <span>View Case Context</span>
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider">
                {caseStudy.area.name}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-bold text-slate-300">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <h2 className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
              {caseStudy.title}
            </h2>
          </div>
        </div>

        {/* Right Status Block */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="text-xs">
            {saveStatus === "saving" && (
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Loader2 size={12} className="animate-spin text-violet-400" />
                <span>Saving response...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium text-[11px]">
                <CheckCircle2 size={12} />
                <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : ""}</span>
              </span>
            )}
            {saveStatus === "error" && (
              <button
                onClick={() => performSave(currentQuestion.id, currentAnswer)}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px] underline cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Save failed. Retry?</span>
              </button>
            )}
            {saveStatus === "idle" && (
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <Clock size={11} />
                <span>Autosave ready</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setViewMode("REVIEW")}
            className="text-xs bg-[#060813] hover:bg-slate-900 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl font-medium border border-white/[0.08] transition-all cursor-pointer"
          >
            Review ({answeredCount}/10)
          </button>
        </div>
      </div>

      {/* Sequential Question Step Indicator Bar */}
      <div className="flex items-center justify-between gap-1.5 px-1 overflow-x-auto py-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const isAnswered = (answersMap[q.id] || "").trim().length > 0;

          return (
            <button
              key={q.id}
              onClick={() => handleJumpToQuestion(idx)}
              className={`flex-1 min-w-[28px] py-1.5 text-center text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                isCurrent
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
                  : isAnswered
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-[#0b1021] text-slate-500 border border-white/[0.06] hover:text-slate-300"
              }`}
              title={`Go to Question ${idx + 1}`}
            >
              Q{idx + 1}
            </button>
          );
        })}
      </div>

      {/* Distinctive Twist / New Information Treatment */}
      {currentQuestion.newInformation && (
        <div className="bg-amber-500/[0.07] border-l-4 border-amber-500 border border-amber-500/20 p-5 rounded-r-2xl shadow-lg space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              New Circumstance / Scenario Development
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed pl-6 font-medium">
            {currentQuestion.newInformation}
          </p>
        </div>
      )}

      {/* Question Prompt & Textarea Card */}
      <div className="bg-[#0b1021] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded border border-violet-500/20">
            Question {currentQuestion.orderNumber}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
            <span>Leadership Reasoning & Strategy</span>
            <span className="font-mono text-slate-400">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={isAdmin}
            placeholder="Structure your analysis, articulate your core decision, identify stakeholder trade-offs, and outline mitigation steps..."
            className="w-full h-56 sm:h-64 bg-[#060813] border border-white/[0.08] focus:border-violet-500/80 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-[#060813] hover:bg-slate-900 disabled:opacity-40 text-slate-300 text-xs font-semibold rounded-xl border border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shadow-violet-900/30 flex items-center gap-1.5 cursor-pointer"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              <>
                <span>Review All Answers</span>
                <FileCheck2 size={15} />
              </>
            ) : (
              <>
                <span>Next Question</span>
                <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Case Context Modal Drawer */}
      {showCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#0b1021] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider">
                  {caseStudy.area.name}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {caseStudy.title}
                </h3>
              </div>
              <button
                onClick={() => setShowCaseModal(false)}
                className="p-1.5 rounded-lg bg-[#060813] border border-white/[0.08] text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              {caseStudy.background && (
                <div className="space-y-1.5 bg-[#060813] p-4 rounded-xl border border-white/[0.06]">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Background Context
                  </h4>
                  <p>{caseStudy.background}</p>
                </div>
              )}

              {caseStudy.currentSituation && (
                <div className="space-y-1.5 bg-[#060813] p-4 rounded-xl border border-white/[0.06]">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Current Situation
                  </h4>
                  <p>{caseStudy.currentSituation}</p>
                </div>
              )}

              {!caseStudy.background && !caseStudy.currentSituation && (
                <div className="space-y-1.5 bg-[#060813] p-4 rounded-xl border border-white/[0.06]">
                  <p>{caseStudy.context}</p>
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowCaseModal(false)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Return to Question
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
