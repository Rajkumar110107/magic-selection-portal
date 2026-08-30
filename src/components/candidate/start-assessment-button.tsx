"use client";

import { useState } from "react";
import { startAssessment } from "@/app/dashboard/assessment-actions";
import { Loader2 } from "lucide-react";

export function StartAssessmentButton({ assignmentId, status }: { assignmentId: string, status?: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await startAssessment(assignmentId);
      }}
      disabled={loading}
      className="w-full bg-primary/20 hover:bg-primary/30 text-primary-foreground font-medium py-2.5 rounded-lg transition-colors border border-primary/50 text-sm flex items-center justify-center"
    >
      {loading ? (
        <><Loader2 size={16} className="animate-spin mr-2" /> Loading...</>
      ) : (
        status === "IN_PROGRESS" ? "Resume Assessment" : 
        status === "COMPLETED" || status === "EVALUATED" ? "View Submission" : 
        "Start Assessment"
      )}
    </button>
  );
}
