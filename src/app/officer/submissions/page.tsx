"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documentsApi } from "@/lib/documents";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DocumentStatus, Severity, Document } from "@/types";
import { useAuth } from "@/lib/AuthContext";

export default function OfficerSubmissions() {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "severity">("newest");
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  // Role check: show message then redirect if user is not an officer
  useEffect(() => {
    if (user && user.role !== "OFFICER") {
      const targetDashboard = user.role === "ADVISOR" ? "advisor" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${user.role.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(user.role === "ADVISOR" ? "/advisor" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await documentsApi.getAll();
        setDocuments(response.documents);
      } catch (err) {
        setError("Failed to load documents");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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
      userName={user?.name || "Officer"}
      title="Submissions"
      subtitle="Review all submitted compliance documents"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      {roleMismatchMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-center mb-6">
          {roleMismatchMessage}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
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
      )}
    </DashboardLayout>
  );
}
