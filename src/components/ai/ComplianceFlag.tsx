"use client";

import { cn } from "@/lib/utils";
import { ComplianceFlag as ComplianceFlagType } from "@/types";
import { AlertTriangle, BookOpen, FileText } from "lucide-react";
import { SeverityBadge } from "@/components/ui/Badge";

interface ComplianceFlagProps {
  flag: ComplianceFlagType;
  isSelected: boolean;
  onClick: () => void;
}

export function ComplianceFlag({
  flag,
  isSelected,
  onClick,
}: ComplianceFlagProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-all",
        isSelected
          ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-medium text-slate-900">{flag.title}</h4>
        <SeverityBadge severity={flag.severity} />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
        <p className="text-sm text-slate-700 italic">&ldquo;{flag.passage}&rdquo;</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Matched Rule</p>
            <p className="text-sm font-medium text-slate-700">
              {flag.matchedRule}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Explanation</p>
            <p className="text-sm text-slate-700">{flag.explanation}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm text-slate-700">Page {flag.page}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
