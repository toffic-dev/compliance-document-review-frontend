"use client";

import { useState } from "react";
import { AIAnalysis } from "@/types";
import { AlertTriangle, RefreshCw, Info, Sparkles } from "lucide-react";
import { ComplianceFlag } from "./ComplianceFlag";
import { ReviewProgress } from "@/components/review/ReviewProgress";
import { Button } from "@/components/ui/Button";
import {
  REVIEW_STAGES,
  analyzeStatuses,
  type ReviewProgressState,
} from "@/lib/reviewProgress";

interface AIAnalysisPanelProps {
  analysis: AIAnalysis | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  documentId?: string;
  onAnalyze?: () => Promise<void>;
  isAnalyzing?: boolean;
  /**
   * How far the analysis run triggered from this screen got. Left `idle` when
   * the analysis was loaded rather than run here, so a revisited submission
   * never claims stages this visit did not observe.
   */
  progress?: ReviewProgressState;
}

export function AIAnalysisPanel({
  analysis,
  isLoading = false,
  isError = false,
  onRetry,
  onAnalyze,
  isAnalyzing = false,
  progress = "idle",
}: AIAnalysisPanelProps) {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  // The run started here and is still in flight: show which stage is being
  // awaited rather than a generic spinner.
  const isRunning = !analysis && (progress === "running" || isAnalyzing);

  if (isRunning) {
    return (
      <ReviewProgress
        stages={REVIEW_STAGES}
        statuses={analyzeStatuses("running")}
        message="Working through the submission. Findings appear here as soon as the analysis returns."
      />
    );
  }

  // A successfully returned analysis is authoritative. A stale error state
  // must never hide findings that were actually received from the backend.
  if (isError && !analysis) {
    // A failed run keeps the stage it stopped on; a failed *read* of an existing
    // analysis has no stages to show, so it stays a plain error card.
    const failedDuringRun = progress === "failed";

    return (
      <div className="space-y-6">
        {failedDuringRun && (
          <ReviewProgress
            stages={REVIEW_STAGES}
            statuses={analyzeStatuses("failed")}
            message="The analysis could not be completed. No stages were marked complete beyond the submission itself."
          />
        )}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {failedDuringRun ? "Analysis failed" : "Could not load the analysis"}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {failedDuringRun
                ? "Running the analysis did not return a result. Try again, or review the document without AI findings."
                : "The compliance analysis for this submission could not be retrieved."}
            </p>
            {onRetry && (
              <Button variant="primary" size="sm" onClick={onRetry} isLoading={isAnalyzing}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No analysis yet
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Run the AI-assisted review to check this submission for compliance
            issues before making a decision.
          </p>
          {onAnalyze && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAnalyze}
              isLoading={isAnalyzing}
            >
              {!isAnalyzing && <Sparkles className="h-4 w-4 mr-2" />}
              Run AI Analysis
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* The run finished on this screen: show the whole pipeline ticked off
          once, so "Review complete" is visible. A re-opened submission skips
          this (progress stays `idle`) and goes straight to the findings. */}
      {progress === "complete" && (
        <ReviewProgress
          stages={REVIEW_STAGES}
          statuses={analyzeStatuses("complete")}
          title="Review complete"
          message="The pipeline finished and the findings below are ready to review."
        />
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
          {onAnalyze && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAnalyze}
              isLoading={isAnalyzing}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Re-analyze
            </Button>
          )}
        </div>
        {analysis.summary && analysis.summary !== "AI summary unavailable." ? (
          <p className="text-sm text-slate-600 leading-relaxed">
            {analysis.summary}
          </p>
        ) : (
          <div className="flex items-start gap-2 text-sm text-slate-500">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              No AI-generated summary was returned for this analysis.
              The compliance findings are still available below.
            </p>
          </div>
        )}
      </div>

      {/* Compliance Flags */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Compliance Flags
          </h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {analysis.flags.length} flag{analysis.flags.length !== 1 && "s"}
          </span>
        </div>
        {analysis.flags.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            No compliance flags detected.
          </p>
        ) : (
          <div className="space-y-3">
            {analysis.flags.map((flag) => (
              <ComplianceFlag
                key={flag.id}
                flag={flag}
                isSelected={selectedFlagId === flag.id}
                onClick={() =>
                  setSelectedFlagId(
                    selectedFlagId === flag.id ? null : flag.id
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              AI-assisted analysis
            </p>
            <p className="text-xs text-blue-700 mt-1">
              AI-generated findings are advisory. The final compliance decision
              must be made by a compliance officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
