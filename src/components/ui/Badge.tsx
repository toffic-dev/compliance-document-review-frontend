import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { DocumentStatus, Severity } from "@/types";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    PENDING_REVIEW: {
      label: "Pending Review",
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    APPROVED: {
      label: "Approved",
      icon: CheckCircle,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    NEEDS_REVISION: {
      label: "Needs Revision",
      icon: AlertTriangle,
      className: "bg-orange-50 text-orange-700 border-orange-200",
    },
  };

  const { label, icon: Icon, className: statusClass } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border",
        statusClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = {
    CRITICAL: {
      label: "Critical",
      className: "bg-red-100 text-red-800 border-red-300",
    },
    HIGH: {
      label: "High",
      className: "bg-orange-100 text-orange-800 border-orange-300",
    },
    MEDIUM: {
      label: "Medium",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    LOW: {
      label: "Low",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
  };

  const { label, className: severityClass } = config[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border uppercase tracking-wide",
        severityClass,
        className
      )}
    >
      {label}
    </span>
  );
}
