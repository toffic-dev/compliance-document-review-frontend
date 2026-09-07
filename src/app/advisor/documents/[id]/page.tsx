"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { documents } from "@/data/documents";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { StatusTimeline } from "@/components/documents/StatusTimeline";
import { RevisionHistory } from "@/components/documents/RevisionHistory";
import { formatDate } from "@/lib/utils";
import { FileText, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DocumentDetails() {
  const params = useParams();
  const docId = params.id as string;
  const doc = documents.find((d) => d.id === docId);

  if (!doc) {
    return (
      <DashboardLayout role="ADVISOR" userName="Alex Johnson" title="Document Not Found">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Document not found</h2>
          <p className="text-sm text-slate-500 mb-4">The document you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/advisor/documents">
            <Button variant="outline">Back to Documents</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADVISOR" userName="Alex Johnson" title="Document Details" subtitle={doc.name}>
      <div className="space-y-6">
        <Link href="/advisor/documents" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{doc.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>Version {doc.version}</span>
                <span>•</span>
                <span>Submitted {formatDate(doc.submittedDate)}</span>
              </div>
            </div>
            <StatusBadge status={doc.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Document Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">File Name</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{doc.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">File Type</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{doc.fileType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">File Size</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{doc.fileSize}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submission Date</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(doc.submittedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Current Version</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">Version {doc.version}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(doc.updatedDate)}</p>
                </div>
              </div>
            </div>

            {/* Revision Requested */}
            {doc.status === "NEEDS_REVISION" && doc.revisionComment && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-orange-900 mb-2">Revision Requested</h3>
                <p className="text-sm text-orange-800">{doc.revisionComment}</p>
                <p className="text-xs text-orange-600 mt-3">
                  Compliance Officer • {formatDate(doc.updatedDate)}
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
              <RevisionHistory revisions={doc.revisions} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Status Timeline</h3>
              <StatusTimeline status={doc.status} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
