"use client";

import { useState } from "react";
import { AIAnalysis } from "@/types";
import { AlertTriangle, RefreshCw, Info } from "lucide-react";
import { ComplianceFlag } from "./ComplianceFlag";
import { Button } from "@/components/ui/Button";

interface AIAnalysisPanelProps {
  analysis: AIAnalysis | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function AIAnalysisPanel({
  analysis,
  isLoading = false,
  isError = false,
  onRetry,
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

  if (isError || !analysis) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            AI analysis unavailable
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            The document can still be reviewed manually.
          </p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Summary</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {analysis.summary}
        </p>
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
