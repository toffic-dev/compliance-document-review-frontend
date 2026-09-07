"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documents } from "@/data/documents";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DocumentStatus, Severity } from "@/types";

export default function OfficerSubmissions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "severity">("newest");

  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.advisorName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
      const matchesSeverity =
        severityFilter === "ALL" ||
        doc.aiAnalysis?.flags.some((f) => f.severity === severityFilter);
      return matchesSearch && matchesStatus && matchesSeverity;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      }
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      const aMax = a.aiAnalysis?.flags.reduce(
        (min, f) => Math.min(min, severityOrder[f.severity]),
        4
      ) ?? 4;
      const bMax = b.aiAnalysis?.flags.reduce(
        (min, f) => Math.min(min, severityOrder[f.severity]),
        4
      ) ?? 4;
      return aMax - bMax;
    });

  const statusFilters: { label: string; value: DocumentStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending Review", value: "PENDING_REVIEW" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Needs Revision", value: "NEEDS_REVISION" },
  ];

  const severityFilters: { label: string; value: Severity | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Critical", value: "CRITICAL" },
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ];

  return (
    <DashboardLayout
      role="OFFICER"
      userName="Dr. Emily Roberts"
      title="Submissions"
      subtitle="Review all submitted compliance documents"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search by document or advisor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  statusFilter === filter.value
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              {severityFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSeverityFilter(filter.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    severityFilter === filter.value
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "severity")}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="severity">Highest severity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <DocumentTable documents={filteredDocs} showAdvisor role="OFFICER" />
      </div>
    </DashboardLayout>
  );
}
