"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documentsApi } from "@/lib/documents";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { FileText, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Document } from "@/types";
import { useAuth } from "@/lib/AuthContext";

export default function OfficerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  // Role check: wait for auth to load, then verify role
  useEffect(() => {
    if (authLoading) return; // Wait for auth state to resolve

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "OFFICER") {
      const targetDashboard = user.role === "ADVISOR" ? "advisor" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${user.role.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(user.role === "ADVISOR" ? "/advisor" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

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

  if (roleMismatchMessage) {
    return (
      <DashboardLayout role="OFFICER" userName={user?.name || "Officer"} title="Redirecting...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-lg inline-block">
              {roleMismatchMessage}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout
        role="OFFICER"
        userName={user?.name || "Officer"}
        title="Compliance Review"
        subtitle="Review and process submitted documents"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="OFFICER"
      userName={user?.name || "Officer"}
      title="Compliance Review"
      subtitle="Review and process submitted documents"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
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
