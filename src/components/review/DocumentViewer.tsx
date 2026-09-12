"use client";

import { useState, useRef, useEffect } from "react";
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
  LayoutGrid,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { documentsApi } from "@/lib/documents";

interface DocumentViewerProps {
  documentId: string;
  documentName: string;
  fileUrl?: string;
  totalPages?: number;
}

type ViewMode = "single" | "all";

const PAGE_BATCH_SIZE = 15;

export function DocumentViewer({
  documentId,
  documentName,
  fileUrl,
  totalPages = 1,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visiblePageCount, setVisiblePageCount] = useState(PAGE_BATCH_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset visible pages when document changes
  useEffect(() => {
    setVisiblePageCount(PAGE_BATCH_SIZE);
  }, [fileUrl]);

  const handleLoadMore = () => {
    setVisiblePageCount((prev) => Math.min(prev + PAGE_BATCH_SIZE, totalPages));
  };

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
  const buildIframeSrc = (pageNum: number) => {
    return fileUrl ? `${fileUrl}#page=${pageNum}` : undefined;
  };

  // Generate array of page numbers for all-pages view
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Pages to render based on current batch
  const visiblePages = pages.slice(0, visiblePageCount);
  const hasMorePages = visiblePageCount < totalPages;

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
          <Button
            variant="ghost"
            size="sm"
            title={viewMode === "single" ? "Show all pages" : "Show single page"}
            onClick={() => setViewMode(viewMode === "single" ? "all" : "single")}
          >
            {viewMode === "single" ? (
              <LayoutGrid className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
          </Button>
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
        {fileUrl ? (
          viewMode === "single" ? (
            <iframe
              src={buildIframeSrc(currentPage)}
              className="w-full h-[600px] border-0"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              title={documentName}
            />
          ) : (
            <div className="w-full space-y-4 overflow-y-auto max-h-[800px]">
              {visiblePages.map((pageNum) => (
                <div key={pageNum} className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 mb-1">Page {pageNum}</span>
                  <iframe
                    src={buildIframeSrc(pageNum)}
                    className="w-full h-[600px] border-0"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                    title={`${documentName} - Page ${pageNum}`}
                  />
                </div>
              ))}
              {hasMorePages && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={handleLoadMore}>
                    Load more pages ({visiblePageCount} of {totalPages} shown)
                  </Button>
                </div>
              )}
            </div>
          )
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
        {viewMode === "single" && (
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
        )}
        {viewMode === "all" && (
          <span className="text-sm text-slate-600">
            Showing {visiblePageCount} of {totalPages} pages
          </span>
        )}
      </div>
    </div>
  );
}
