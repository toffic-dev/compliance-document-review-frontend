"use client";

import { cn, formatDate } from "@/lib/utils";
import { Revision } from "@/types";
import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

interface RevisionHistoryProps {
  revisions: Revision[];
}

export function RevisionHistory({ revisions }: RevisionHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "PENDING_REVIEW":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "NEEDS_REVISION":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const sortedRevisions = [...revisions].sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-0">
      {sortedRevisions.map((revision, index) => (
        <div key={revision.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                revision.isCurrent
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {getStatusIcon(revision.status)}
            </div>
            {index < sortedRevisions.length - 1 && (
              <div className="w-0.5 h-12 bg-slate-200" />
            )}
          </div>
          <div className="pb-6">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-900">
                Version {revision.version}
              </p>
              {revision.isCurrent && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatDate(revision.date)}
            </p>
            {revision.comment && (
              <p className="text-sm text-slate-600 mt-2">{revision.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
