"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documents } from "@/data/documents";
import { FileText, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { DocumentTable } from "@/components/documents/DocumentTable";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdvisorDashboard() {
  const advisorDocs = documents.filter((d) => d.advisorId === "user-1");

  const stats = {
    total: advisorDocs.length,
    pending: advisorDocs.filter((d) => d.status === "PENDING_REVIEW").length,
    approved: advisorDocs.filter((d) => d.status === "APPROVED").length,
    needsRevision: advisorDocs.filter((d) => d.status === "NEEDS_REVISION").length,
    rejected: advisorDocs.filter((d) => d.status === "REJECTED").length,
  };

  const recentDocs = advisorDocs.slice(0, 5);

  return (
    <DashboardLayout
      role="ADVISOR"
      userName="Alex Johnson"
      title="Dashboard"
      subtitle="Track your compliance submissions and review status"
    >
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Good morning, Alex
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your compliance submissions and review status.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.total}
                </p>
                <p className="text-xs text-slate-500">Total Documents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.pending}
                </p>
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
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.approved}
                </p>
                <p className="text-xs text-slate-500">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.needsRevision}
                </p>
                <p className="text-xs text-slate-500">Needs Revision</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.rejected}
                </p>
                <p className="text-xs text-slate-500">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Recent Documents
            </h3>
            <Link href="/advisor/documents/upload">
              <Button size="sm">Upload Document</Button>
            </Link>
          </div>
          <DocumentTable documents={recentDocs} role="ADVISOR" />
        </div>
      </div>
    </DashboardLayout>
  );
}
