"use client";

import { cn, formatDate } from "@/lib/utils";
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { DocumentStatus } from "@/types";

/** The officer's recorded outcome, as stored by `POST /reviews`. */
export interface ReviewOutcome {
  decision: "APPROVE" | "REJECT" | "REQUEST_REVISION";
  timestamp?: string;
  officerName?: string;
  comment?: string;
}

interface StatusTimelineProps {
  status: DocumentStatus;
  /**
   * Whether an AI analysis exists for this submission.
   *
   * `undefined` means the caller has not checked, and the step is then left
   * neutral. It is never marked done on a guess: an analysis only exists once a
   * reviewer actually ran one, so a document sitting in the queue has none.
   */
  hasAnalysis?: boolean;
  /** The officer's decision, when one has been recorded. */
  outcome?: ReviewOutcome;
  /** Date the submission was received. */
  submittedDate?: string;
  /** Date the AI analysis was produced, when it is known. */
  analysisDate?: string;
}

type StepState = "done" | "current" | "upcoming" | "revision" | "rejected";

interface Step {
  key: string;
  label: string;
  /** What actually happened (or is awaited), shown under the label. */
  detail?: string;
  state: StepState;
}

const MARKER_STYLES: Record<StepState, string> = {
  done: "bg-emerald-100 text-emerald-600",
  current: "bg-amber-100 text-amber-600",
  upcoming: "bg-slate-100 text-slate-400",
  revision: "bg-orange-100 text-orange-600",
  rejected: "bg-red-100 text-red-600",
};

const CONNECTOR_STYLES: Record<StepState, string> = {
  done: "bg-emerald-300",
  current: "bg-slate-200",
  upcoming: "bg-slate-200",
  revision: "bg-orange-200",
  rejected: "bg-red-200",
};

function StepMarker({ state }: { state: StepState }) {
  const className = "h-4 w-4";

  if (state === "revision") return <AlertTriangle className={className} />;
  if (state === "rejected") return <XCircle className={className} />;
  if (state === "done") return <CheckCircle className={className} />;
  if (state === "current") return <Clock className={className} />;
  return <Circle className={className} />;
}

/**
 * The submission's progress, told from the side of the people acting on it: the
 * advisor submits, a reviewer may run an AI analysis, the compliance officer
 * reviews and then records one decision.
 *
 * Each step reflects something that was actually recorded — the submission
 * itself, a stored analysis, and the officer's decision that the backend saved
 * as a review. Nothing is inferred from expected ordering, so a submission that
 * was decided without an analysis shows the analysis as not run instead of
 * silently ticking it off.
 */
export function StatusTimeline({
  status,
  hasAnalysis,
  outcome,
  submittedDate,
  analysisDate,
}: StatusTimelineProps) {
  const decided = status !== "PENDING_REVIEW";

  const analysisDetail =
    hasAnalysis === true
      ? analysisDate
        ? `Run ${formatDate(analysisDate)}`
        : "Available to the reviewer"
      : hasAnalysis === false
        ? decided
          ? "Not run before the decision"
          : "Not run yet"
        : "Not run yet";

  const decisionDetail = () => {
    if (outcome) {
      const when = outcome.timestamp ? ` on ${formatDate(outcome.timestamp)}` : "";
      const who = outcome.officerName ? ` by ${outcome.officerName}` : "";
      if (outcome.decision === "APPROVE") return `Approved${who}${when}`;
      if (outcome.decision === "REJECT") return `Rejected${who}${when}`;
      return `Revision requested${who}${when}`;
    }

    // No review record available: fall back to the document's own status, which
    // the backend updates when a decision is saved.
    if (status === "APPROVED") return "Approved by the compliance officer";
    if (status === "REJECTED") return "Rejected by the compliance officer";
    if (status === "NEEDS_REVISION") {
      return "Revision requested by the compliance officer";
    }
    return "Awaiting the compliance officer's decision";
  };

  const steps: Step[] = [
    {
      key: "submitted",
      label: "Submitted for review",
      detail: submittedDate
        ? `Received ${formatDate(submittedDate)}`
        : "Received for compliance review",
      state: "done",
    },
    {
      key: "analysis",
      label: "AI analysis",
      detail: analysisDetail,
      state: hasAnalysis === true ? "done" : "upcoming",
    },
    {
      key: "review",
      label: "Officer review",
      detail: decided
        ? "Reviewed by the compliance officer"
        : "Queued with the compliance officer",
      state: decided ? "done" : "current",
    },
    {
      key: "decision",
      label:
        status === "APPROVED"
          ? "Approved"
          : status === "REJECTED"
            ? "Rejected"
            : status === "NEEDS_REVISION"
              ? "Revision requested"
              : "Decision",
      detail: decisionDetail(),
      state:
        status === "APPROVED"
          ? "done"
          : status === "REJECTED"
            ? "rejected"
            : status === "NEEDS_REVISION"
              ? "revision"
              : "upcoming",
    },
  ];

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.key}
            aria-current={step.state === "current" ? "step" : undefined}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <div
                aria-hidden="true"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  MARKER_STYLES[step.state]
                )}
              >
                <StepMarker state={step.state} />
              </div>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn("h-8 w-0.5", CONNECTOR_STYLES[step.state])}
                />
              )}
            </div>
            <div className="min-w-0 pt-1 pb-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.state === "upcoming" ? "text-slate-400" : "text-slate-900"
                )}
              >
                {step.label}
              </p>
              {step.detail && (
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {step.detail}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}