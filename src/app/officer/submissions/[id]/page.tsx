"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documents } from "@/data/documents";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { DocumentViewer } from "@/components/review/DocumentViewer";
import { AIAnalysisPanel } from "@/components/ai/AIAnalysisPanel";
import { DecisionPanel } from "@/components/review/DecisionPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { FileText, ArrowLeft, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/types";

export default function OfficerReview() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;
  const doc = documents.find((d) => d.id === docId);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentStatus, setCurrentStatus] = useState(doc?.status || "PENDING_REVIEW");
  const [aiError, setAiError] = useState(false);

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApprove = () => {
    setCurrentStatus("APPROVED");
    addToast("Document approved", "success");
  };

  const handleReject = () => {
    setCurrentStatus("REJECTED");
    addToast("Document rejected", "success");
  };

  const handleRequestRevision = () => {
    setCurrentStatus("NEEDS_REVISION");
    addToast("Revision requested", "success");
  };

  if (!doc) {
    return (
      <DashboardLayout role="OFFICER" userName="Dr. Emily Roberts" title="Document Not Found">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Document not found</h2>
          <p className="text-sm text-slate-500 mb-4">The document you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/officer/submissions">
            <Button variant="outline">Back to Submissions</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="OFFICER" userName="Dr. Emily Roberts" title="Review Document" subtitle={doc.name}>
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
              <h2 className="text-lg font-semibold text-slate-900">{doc.name}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Submitted by {doc.advisorName} • Version {doc.version}
              </p>
            </div>
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Document Viewer */}
          <div>
            <DocumentViewer documentName={doc.name} />
          </div>

          {/* AI Analysis */}
          <div>
            <AIAnalysisPanel
              analysis={doc.aiAnalysis}
              isError={aiError}
              onRetry={() => setAiError(false)}
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
