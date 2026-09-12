"use client";

import { useState, useRef } from "react";
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
import { documentsApi } from "@/lib/documents";

interface DocumentViewerProps {
  documentId: string;
  documentName: string;
  fileUrl?: string;
}

export function DocumentViewer({
  documentId,
  documentName,
  fileUrl,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handleDownload = async () => {
    try {
      const blob = await documentsApi.download(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleSearch = () => {
    // Open browser's find-in-page dialog
    window.getSelection()?.removeAllRanges();
    const event = new KeyboardEvent("keydown", { key: "f", ctrlKey: true, metaKey: true });
    window.dispatchEvent(event);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  // Build iframe URL with page fragment for PDF navigation
  const iframeSrc = fileUrl ? `${fileUrl}#page=${currentPage}&zoom=${zoom}` : undefined;

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
          <Button variant="ghost" size="sm" title="Search" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Download" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Fullscreen" onClick={handleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <div ref={containerRef} className="relative bg-slate-100 min-h-[500px] flex items-center justify-center p-4">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="w-full h-[600px] border-0"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            title={documentName}
          />
        ) : (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Document preview not available</p>
            <p className="text-xs text-slate-400 mt-1">Click download to view the file</p>
          </div>
        )}
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
            Page {currentPage}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
