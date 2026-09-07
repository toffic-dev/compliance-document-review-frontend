"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Circle, AlertTriangle } from "lucide-react";
import { DocumentStatus } from "@/types";

interface StatusTimelineProps {
  status: DocumentStatus;
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const steps = [
    { key: "submitted", label: "Submitted", icon: CheckCircle },
    { key: "analysis", label: "Analysis", icon: CheckCircle },
    { key: "review", label: "Officer Review", icon: CheckCircle },
    { key: "decision", label: "Decision", icon: Circle },
  ];

  const getStepStatus = (stepKey: string) => {
    if (status === "PENDING_REVIEW") {
      if (stepKey === "submitted" || stepKey === "analysis") return "completed";
      if (stepKey === "review") return "current";
      return "upcoming";
    }
    if (status === "APPROVED") {
      if (stepKey === "decision") return "completed";
      return "completed";
    }
    if (status === "REJECTED") {
      if (stepKey === "decision") return "rejected";
      return "completed";
    }
    if (status === "NEEDS_REVISION") {
      if (stepKey === "decision") return "revision";
      return "completed";
    }
    return "upcoming";
  };

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.key);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  stepStatus === "completed" &&
                    "bg-emerald-100 text-emerald-600",
                  stepStatus === "current" && "bg-amber-100 text-amber-600",
                  stepStatus === "upcoming" && "bg-slate-100 text-slate-400",
                  stepStatus === "rejected" && "bg-red-100 text-red-600",
                  stepStatus === "revision" && "bg-orange-100 text-orange-600"
                )}
              >
                {stepStatus === "revision" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : stepStatus === "completed" ||
                  stepStatus === "rejected" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-8",
                    stepStatus === "completed"
                      ? "bg-emerald-300"
                      : "bg-slate-200"
                  )}
                />
              )}
            </div>
            <div className="pt-1.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  stepStatus === "upcoming"
                    ? "text-slate-400"
                    : "text-slate-900"
                )}
              >
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
