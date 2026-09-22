"use client";

import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  activeIndex,
  completedCount,
  isCurrentStep,
  type ReviewStage,
  type ReviewStepStatus,
} from "@/lib/reviewProgress";

/** Wording screen readers get for each step state. */
const STATUS_TEXT: Record<ReviewStepStatus, string> = {
  complete: "completed",
  active: "in progress",
  pending: "not started",
  failed: "failed",
};

const MARKER_STYLES: Record<ReviewStepStatus, string> = {
  complete: "border-slate-900 bg-slate-900 text-white",
  active:
    "border-indigo-500 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-500/15",
  pending: "border-slate-200 bg-white text-slate-300",
  failed: "border-red-500 bg-red-50 text-red-600 ring-4 ring-red-500/10",
};

const LABEL_STYLES: Record<ReviewStepStatus, string> = {
  complete: "text-slate-700",
  active: "font-semibold text-slate-900",
  pending: "text-slate-400",
  failed: "font-semibold text-red-700",
};

interface ReviewProgressProps {
  stages: ReviewStage[];
  statuses: ReviewStepStatus[];
  title?: string;
  /** Short line describing what is happening right now. */
  message?: string;
  className?: string;
}

/**
 * Step-by-step progress for the review pipeline.
 *
 * A vertical rail on small screens and a horizontal stepper from `sm` up. Only
 * the states handed in are rendered — the component never advances itself, so a
 * stage cannot appear finished unless its caller observed that it finished.
 */
export function ReviewProgress({
  stages,
  statuses,
  title = "Review progress",
  message,
  className,
}: ReviewProgressProps) {
  const done = completedCount(statuses);
  const current = activeIndex(statuses);
  const hasFailed = statuses.includes("failed");

  return (
    <section
      aria-label={title}
      className={cn(
        "rounded-xl border bg-white p-5",
        hasFailed ? "border-red-200" : "border-slate-200",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {done} of {stages.length} stages complete
        </span>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "mt-2 text-xs leading-relaxed",
            hasFailed ? "text-red-600" : "text-slate-500"
          )}
        >
          {message}
        </p>
      )}

      <ol className="mt-5 flex flex-col sm:flex-row sm:items-start">
        {stages.map((stage, index) => {
          const status = statuses[index] ?? "pending";
          // A segment only looks "travelled" when the stage before it is known
          // to have finished.
          const segmentDone = statuses[index] === "complete";
          const isLast = index === stages.length - 1;

          return (
            <li
              key={stage.label}
              aria-current={isCurrentStep(status) ? "step" : undefined}
              className={cn(
                "relative flex gap-3",
                !isLast && "pb-6 sm:pb-0",
                "sm:flex-1 sm:block sm:text-center"
              )}
            >
              {/* Vertical connector (mobile rail) */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-0.5 rounded-full sm:hidden",
                    segmentDone
                      ? "bg-gradient-to-b from-slate-900 to-indigo-400"
                      : "bg-slate-200"
                  )}
                />
              )}

              {/* Horizontal connector (desktop stepper) */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-3 hidden h-0.5 rounded-full sm:block",
                    segmentDone
                      ? "bg-gradient-to-r from-slate-900 to-indigo-400"
                      : "bg-slate-200"
                  )}
                />
              )}

              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  MARKER_STYLES[status],
                  "sm:mx-auto"
                )}
              >
                {status === "complete" && <Check className="h-3.5 w-3.5" />}
                {status === "active" && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {status === "pending" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                )}
                {status === "failed" && <X className="h-3.5 w-3.5" />}
              </span>

              <div className="min-w-0 sm:mt-2.5">
                <p
                  className={cn(
                    "text-sm leading-tight",
                    LABEL_STYLES[status]
                  )}
                >
                  {stage.label}
                  <span className="sr-only"> — {STATUS_TEXT[status]}</span>
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs leading-relaxed",
                    status === "pending" ? "text-slate-400" : "text-slate-500",
                    "sm:px-1"
                  )}
                >
                  {stage.hint}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {current >= 0 && (
        <p className="sr-only" aria-live="polite">
          Current stage: {stages[current]?.label}
        </p>
      )}
    </section>
  );
}