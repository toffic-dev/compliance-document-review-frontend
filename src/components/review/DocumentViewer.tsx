"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Search,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DocumentViewerProps {
  documentName: string;
  totalPages?: number;
}

export function DocumentViewer({
  documentName,
  totalPages = 8,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
            {documentName}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" title="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Fullscreen">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="relative bg-slate-100 min-h-[500px] flex items-center justify-center p-8">
        <div
          className="bg-white shadow-lg rounded-lg p-8 max-w-[600px] w-full transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Mock document content */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Compliance Document
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                This document outlines the organization&apos;s policies and
                procedures regarding data protection and compliance requirements.
                All employees and contractors must adhere to these guidelines.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                The organization may retain customer information indefinitely for
                the purpose of service improvement and regulatory compliance.
                Data subjects have the right to request deletion of their
                personal information.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 my-4">
                <p className="text-sm text-slate-700 italic">
                  &ldquo;Users implicitly agree to data collection by using our
                  services.&rdquo;
                </p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                In the event of a data breach, affected parties will be notified
                through appropriate channels. The organization maintains
                comprehensive incident response procedures.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Regular audits are conducted to ensure ongoing compliance with
                applicable regulations and industry standards. Audit findings
                are documented and addressed through corrective action plans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600 w-12 text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
