"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documents } from "@/data/documents";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { FileText, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function OfficerDashboard() {
  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "PENDING_REVIEW").length,
    approved: documents.filter((d) => d.status === "APPROVED").length,
    rejected: documents.filter((d) => d.status === "REJECTED").length,
    needsRevision: documents.filter((d) => d.status === "NEEDS_REVISION").length,
  };

  const pendingDocs = documents
    .filter((d) => d.status === "PENDING_REVIEW")
    .slice(0, 5);

  return (
    <DashboardLayout
      role="OFFICER"
      userName="Dr. Emily Roberts"
      title="Compliance Review"
      subtitle="Review and process submitted documents"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Total Submissions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.pending}</p>
                <p className="text-xs text-slate-500">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.approved}</p>
                <p className="text-xs text-slate-500">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.rejected}</p>
                <p className="text-xs text-slate-500">Rejected</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.needsRevision}</p>
                <p className="text-xs text-slate-500">Needs Revision</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Queue */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-4">Submission Queue</h3>
          <DocumentTable documents={pendingDocs} showAdvisor role="OFFICER" />
        </div>
      </div>
    </DashboardLayout>
  );
}
