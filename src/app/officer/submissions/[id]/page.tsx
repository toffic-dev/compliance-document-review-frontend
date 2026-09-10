"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documentsApi, reviewsApi } from "@/lib/documents";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { DocumentViewer } from "@/components/review/DocumentViewer";
import { AIAnalysisPanel } from "@/components/ai/AIAnalysisPanel";
import { DecisionPanel } from "@/components/review/DecisionPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { FileText, ArrowLeft, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Document, Toast, AIAnalysis } from "@/types";
import { useAuth } from "@/lib/AuthContext";

export default function OfficerReview() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;
  const [document, setDocument] = useState<Document | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Document["status"]>("PENDING_REVIEW");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const doc = await documentsApi.getById(docId);
        setDocument(doc);
        setCurrentStatus(doc.status);
        setAnalysis(doc.aiAnalysis);
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
  }, [docId]);

  const fetchAnalysis = async () => {
    if (!document) return;
    try {
      setIsAnalysisLoading(true);
      setAiError(false);
      const result = await documentsApi.getAnalysis(document.id);
      setAnalysis(result);
      addToast("Analysis loaded successfully", "success");
    } catch (err) {
      setAiError(true);
      addToast("Failed to load analysis", "error");
      console.error(err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    if (!document) return;
    try {
      setIsAnalysisLoading(true);
      setAiError(false);
      addToast("Running AI analysis...", "info");
      const result = await documentsApi.triggerAnalysis(document.id);
      setAnalysis(result);
      addToast("Analysis complete", "success");
    } catch (err) {
      setAiError(true);
      addToast("Failed to run analysis", "error");
      console.error(err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleAnalysisRetry = () => {
    if (analysis) {
      triggerAnalysis();
    } else {
      fetchAnalysis();
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

  if (isLoading) {
    return (
      <DashboardLayout role="OFFICER" userName={user?.name || "Officer"} title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !document) {
    return (
      <DashboardLayout role="OFFICER" userName={user?.name || "Officer"} title="Document Not Found">
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
    <DashboardLayout role="OFFICER" userName={user?.name || "Officer"} title="Review Document" subtitle={document.name}>
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
            <DocumentViewer documentName={document.name} />
          </div>

          {/* AI Analysis */}
          <div>
            <AIAnalysisPanel
              analysis={analysis}
              isLoading={isAnalysisLoading}
              isError={aiError}
              onRetry={handleAnalysisRetry}
              onAnalyze={analysis ? triggerAnalysis : fetchAnalysis}
              isAnalyzing={isAnalysisLoading}
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
