"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documents } from "@/data/documents";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { DocumentStatus } from "@/types";

export default function AdvisorDocuments() {
  const advisorDocs = documents.filter((d) => d.advisorId === "user-1");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");

  const filteredDocs = advisorDocs.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filters: { label: string; value: DocumentStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending Review", value: "PENDING_REVIEW" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Needs Revision", value: "NEEDS_REVISION" },
  ];

  return (
    <DashboardLayout
      role="ADVISOR"
      userName="Alex Johnson"
      title="Documents"
      subtitle="Manage your compliance documents"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Link href="/advisor/documents/upload">
            <Button>Upload Document</Button>
          </Link>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {filters.map((filter) => (
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

        {/* Documents Table */}
        <DocumentTable documents={filteredDocs} role="ADVISOR" />
      </div>
    </DashboardLayout>
  );
}
