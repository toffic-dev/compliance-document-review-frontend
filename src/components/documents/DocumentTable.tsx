"use client";

import { formatDate } from "@/lib/utils";
import { Document } from "@/types";
import { FileText, Eye, Download } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/Button";
import { documentsApi } from "@/lib/documents";

interface DocumentTableProps {
  documents: Document[];
  showAdvisor?: boolean;
  role?: "ADVISOR" | "OFFICER";
}

export function DocumentTable({
  documents,
  showAdvisor = false,
  role = "ADVISOR",
}: DocumentTableProps) {
  const handleDownload = async (doc: Document) => {
    try {
      const blob = await documentsApi.download(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleView = (doc: Document) => {
    const path =
      role === "ADVISOR"
        ? `/advisor/documents/${doc.id}`
        : `/officer/submissions/${doc.id}`;
    window.open(path, "_blank");
  };
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No documents found
        </h3>
        <p className="text-sm text-slate-500">
          {role === "ADVISOR"
            ? "Upload your first compliance document to get started."
            : "No submissions match your current filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Document
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Type
              </th>
              {showAdvisor && (
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                  Advisor
                </th>
              )}
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Version
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Submitted
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Updated
              </th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                      {doc.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{doc.fileType}</span>
                </td>
                {showAdvisor && (
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">
                      {doc.advisorName}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">v{doc.version}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">
                    {formatDate(doc.submittedDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">
                    {formatDate(doc.updatedDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="View document"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Download document"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
