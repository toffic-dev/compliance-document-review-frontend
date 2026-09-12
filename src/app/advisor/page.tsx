"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documentsApi } from "@/lib/documents";
import { FileText, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { DocumentTable } from "@/components/documents/DocumentTable";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Document } from "@/types";
import { useAuth } from "@/lib/AuthContext";

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  // Role check: show message then redirect if user is not an advisor
  useEffect(() => {
    if (user && user.role !== "ADVISOR") {
      const targetDashboard = user.role === "OFFICER" ? "officer" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${user.role.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(user.role === "OFFICER" ? "/officer" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await documentsApi.getAll({ advisorId: user?.id });
        setDocuments(response.documents);
      } catch (err) {
        setError("Failed to load documents");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDocuments();
    }
  }, [user?.id]);

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "PENDING_REVIEW").length,
    approved: documents.filter((d) => d.status === "APPROVED").length,
    needsRevision: documents.filter((d) => d.status === "NEEDS_REVISION").length,
    rejected: documents.filter((d) => d.status === "REJECTED").length,
  };

  const recentDocs = documents.slice(0, 5);

  if (isLoading) {
    return (
      <DashboardLayout
        role="ADVISOR"
        userName={user?.name || "Advisor"}
        title="Dashboard"
        subtitle="Track your compliance submissions and review status"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="ADVISOR"
      userName={user?.name || "Advisor"}
      title="Dashboard"
      subtitle="Track your compliance submissions and review status"
    >
      {roleMismatchMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-center mb-6">
          {roleMismatchMessage}
        </div>
      )}
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Good morning, {user?.name?.split(" ")[0] || "Advisor"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your compliance submissions and review status.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

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
