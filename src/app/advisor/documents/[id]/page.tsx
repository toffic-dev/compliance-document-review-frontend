"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documentsApi } from "@/lib/documents";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { StatusTimeline } from "@/components/documents/StatusTimeline";
import { RevisionHistory } from "@/components/documents/RevisionHistory";
import { formatDate } from "@/lib/utils";
import { FileText, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Document } from "@/types";
import { useAuth } from "@/lib/AuthContext";

export default function DocumentDetails() {
  const { user } = useAuth();
  const params = useParams();
  const docId = params.id as string;
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const doc = await documentsApi.getById(docId);
        setDocument(doc);
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

  if (isLoading) {
    return (
      <DashboardLayout role="ADVISOR" userName={user?.name || "Advisor"} title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !document) {
    return (
      <DashboardLayout role="ADVISOR" userName={user?.name || "Advisor"} title="Document Not Found">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Document not found</h2>
          <p className="text-sm text-slate-500 mb-4">
            {error || "The document you're looking for doesn't exist."}
          </p>
          <Link href="/advisor/documents">
            <Button variant="outline">Back to Documents</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADVISOR" userName={user?.name || "Advisor"} title="Document Details" subtitle={document.name}>
      <div className="space-y-6">
        <Link href="/advisor/documents" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{document.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>Version {document.version}</span>
                <span>•</span>
                <span>Submitted {formatDate(document.submittedDate)}</span>
              </div>
            </div>
            <StatusBadge status={document.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Document Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">File Name</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{document.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">File Type</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{document.fileType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">File Size</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{document.fileSize}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submission Date</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(document.submittedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Current Version</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">Version {document.version}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(document.updatedDate)}</p>
                </div>
              </div>
            </div>

            {/* Revision Requested */}
            {document.status === "NEEDS_REVISION" && document.revisionComment && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-orange-900 mb-2">Revision Requested</h3>
                <p className="text-sm text-orange-800">{document.revisionComment}</p>
                <p className="text-xs text-orange-600 mt-3">
                  Compliance Officer • {formatDate(document.updatedDate)}
                </p>
                <Button className="mt-4" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Submit Revision
                </Button>
              </div>
            )}

            {/* Revision History */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Revision History</h3>
              <RevisionHistory revisions={document.revisions} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Status Timeline</h3>
              <StatusTimeline status={document.status} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
