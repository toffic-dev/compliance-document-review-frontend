"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documentsApi, reviewsApi } from "@/lib/documents";
import { ApiError } from "@/lib/api";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { DocumentViewer } from "@/components/review/DocumentViewer";
import { AIAnalysisPanel } from "@/components/ai/AIAnalysisPanel";
import { DecisionPanel } from "@/components/review/DecisionPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Document, Toast, AIAnalysis } from "@/types";
import { type ReviewProgressState } from "@/lib/reviewProgress";
import { useAuth } from "@/lib/AuthContext";
import { normalizeRole } from "@/lib/utils";

export default function OfficerReview() {
  const { user, isLoading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;
  const [document, setDocument] = useState<Document | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);
  /**
   * How the analysis *run triggered from this screen* is going. Tracked here
   * rather than inferred in the panel, because only the caller knows whether an
   * analysis was just produced or merely loaded from a previous session.
   */
  const [analysisProgress, setAnalysisProgress] = useState<ReviewProgressState>("idle");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Document["status"]>("PENDING_REVIEW");
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  /**
   * Reads the analysis a submission already has. A 404 is the expected answer for
   * a document that has never been analyzed (the panel then offers to run one);
   * any other failure is a real error worth surfacing, so the officer can retry
   * the fetch instead of being left with a silently empty panel.
   */
  const loadAnalysis = useCallback(async (id: string) => {
    // Reading an existing analysis is not a run: clear any stages left over from
    // a previous analysis on this screen so nothing stale stays ticked off.
    setAnalysisProgress("idle");
    try {
      const result = await documentsApi.getAnalysis(id);
      setAnalysis(result);
      setAiError(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setAnalysis(undefined);
        setAiError(false);
      } else {
        setAiError(true);
        console.error(err);
      }
    }
  }, []);

  const retryLoadAnalysis = () => {
    if (document) void loadAnalysis(document.id);
  };

  // Role check: wait for auth to load, then verify role
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const normalizedRole = normalizeRole(user.role);
    if (normalizedRole !== "COMPLIANCE_OFFICER") {
      const targetDashboard = normalizedRole === "ADVISOR" ? "advisor" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${normalizedRole.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(normalizedRole === "ADVISOR" ? "/advisor" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const doc = await documentsApi.getById(docId);
        setDocument(doc);
        setCurrentStatus(doc.status);

        // The analysis is not part of the document response, so it is fetched
        // separately. This GET only *reads* an existing analysis — running one is
        // the explicit "Run AI Analysis" action below, so reopening a submission
        // never triggers new work.
        await loadAnalysis(doc.id);
      } catch (err) {
        setError("Failed to load document");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (docId) {
      fetchDocument();
    }
  }, [docId, loadAnalysis]);

  const triggerAnalysis = async () => {
    if (!document) return;
    try {
      setIsAnalysisLoading(true);
      setAiError(false);
      setAnalysisProgress("running");
      addToast("Running AI analysis...", "info");
      const result = await documentsApi.triggerAnalysis(document.id);
      setAnalysis(result);
      setAiError(false);
      // Only now, with the returned findings in hand, can the pipeline stages be
      // reported as complete.
      setAnalysisProgress("complete");
      addToast("Analysis complete", "success");
    } catch (err) {
      setAiError(true);
      setAnalysisProgress("failed");
      addToast("Failed to run analysis", "error");
      console.error(err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApprove = async (comment: string) => {
    if (!document || !user) return;
    try {
      await reviewsApi.submit({
        documentId: document.id,
        decision: "APPROVE",
        comment,
        officerId: user.id,
      });
      setCurrentStatus("APPROVED");
      addToast("Document approved", "success");
    } catch (err) {
      addToast("Failed to submit decision", "error");
      console.error(err);
    }
  };

  const handleReject = async (comment: string) => {
    if (!document || !user) return;
    try {
      await reviewsApi.submit({
        documentId: document.id,
        decision: "REJECT",
        comment,
        officerId: user.id,
      });
      setCurrentStatus("REJECTED");
      addToast("Document rejected", "success");
    } catch (err) {
      addToast("Failed to submit decision", "error");
      console.error(err);
    }
  };

  const handleRequestRevision = async (comment: string) => {
    if (!document || !user) return;
    try {
      await reviewsApi.submit({
        documentId: document.id,
        decision: "REQUEST_REVISION",
        comment,
        officerId: user.id,
      });
      setCurrentStatus("NEEDS_REVISION");
      addToast("Revision requested", "success");
    } catch (err) {
      addToast("Failed to submit decision", "error");
      console.error(err);
    }
  };

  if (roleMismatchMessage) {
    return (
      <DashboardLayout role="COMPLIANCE_OFFICER" userName={user?.name || "Officer"} title="Redirecting...">
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
      <DashboardLayout role="COMPLIANCE_OFFICER" userName={user?.name || "Officer"} title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !document) {
    return (
      <DashboardLayout role="COMPLIANCE_OFFICER" userName={user?.name || "Officer"} title="Document Not Found">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Document not found</h2>
          <p className="text-sm text-slate-500 mb-4">
            {error || "The document you're looking for doesn't exist."}
          </p>
          <Link href="/officer/submissions">
            <Button variant="outline">Back to Submissions</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="COMPLIANCE_OFFICER" userName={user?.name || "Officer"} title="Review Document" subtitle={document.name}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="space-y-6">
        <Link href="/officer/submissions" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{document.name}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Submitted by {document.advisorName} • Version {document.version}
              </p>
            </div>
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Document Viewer */}
          <div>
            <DocumentViewer
              documentId={document.id}
              documentName={document.name}
              totalPages={document.totalPages}
            />
          </div>

          {/* AI Analysis */}
          <div>
            <AIAnalysisPanel
              analysis={analysis}
              isError={aiError}
              onRetry={retryLoadAnalysis}
              onAnalyze={triggerAnalysis}
              isAnalyzing={isAnalysisLoading}
              progress={analysisProgress}
            />
          </div>
        </div>

        {/* Decision Panel */}
        <DecisionPanel
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestRevision={handleRequestRevision}
          disabled={currentStatus !== "PENDING_REVIEW"}
        />
      </div>
    </DashboardLayout>
  );
}
