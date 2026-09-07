"use client";

import { StatusBadge as Badge } from "@/components/ui/Badge";
import { DocumentStatus } from "@/types";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <Badge status={status} className={className} />;
}
