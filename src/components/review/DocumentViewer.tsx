"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { documentsApi } from "@/lib/documents";
import {
  previewKindFor,
  withRenderableType,
  type PreviewKind,
} from "@/lib/documentPreview";

interface DocumentViewerProps {
  documentId: string;
  documentName: string;
  totalPages?: number;
}

type ViewMode = "single" | "all";

const PAGE_BATCH_SIZE = 15;

export function DocumentViewer({
  documentId,
  documentName,
  totalPages = 1,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [visiblePageCount, setVisiblePageCount] = useState(PAGE_BATCH_SIZE);
  const [lastDocumentId, setLastDocumentId] = useState(documentId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<PreviewKind | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [showSearchHint, setShowSearchHint] = useState(false);
  // Kept in a ref as well so the object URL can be released without a state
  // update from a cleanup function.
  const previewUrlRef = useRef<string | null>(null);

  // Fetch file as blob and create object URL for authenticated preview
  const fetchPreview = useCallback(async () => {
    setPreviewLoading(true);
    setPreviewError(false);
    try {
      const blob = await documentsApi.download(documentId);
      const kind = previewKindFor(documentName, blob.type);

      // Only PDFs, images and text can render in a frame; a Word or Excel file
      // has no browser viewer, so it is offered as a download instead.
      const url =
        kind === 'unsupported'
          ? null
          : URL.createObjectURL(withRenderableType(blob, kind, documentName));

      // Release the previous object URL only once its replacement is ready.
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      previewUrlRef.current = url;

      setPreviewKind(kind);
      setPreviewUrl(url);
    } catch (err) {
      console.error("[DocumentViewer] Failed to load preview:", err);
      setPreviewError(true);
    } finally {
      setPreviewLoading(false);
    }
  }, [documentId, documentName]);

  useEffect(() => {
    fetchPreview();
    return () => {
      // Release the object URL when the viewer unmounts or the document changes.
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [fetchPreview]);

  // Switching documents resets the page paging state. Derived during render so
  // the reset happens before the new document's first paint.
  if (lastDocumentId !== documentId) {
    setLastDocumentId(documentId);
    setCurrentPage(1);
    setVisiblePageCount(PAGE_BATCH_SIZE);
    setShowSearchHint(false);
  }

  // The API does not report a page count, so `1` means "unknown": without a real
  // count the pager would claim a single page and cannot be trusted.
  const hasKnownPageCount = totalPages > 1;
  const pageCount = hasKnownPageCount ? totalPages : 1;
  // Paging controls only apply to documents the browser paginates (PDFs).
  const supportsPaging = hasKnownPageCount && previewKind === "pdf";
  const effectiveViewMode: ViewMode = supportsPaging ? viewMode : "single";

  const handleLoadMore = () => {
    setVisiblePageCount((prev) => Math.min(prev + PAGE_BATCH_SIZE, pageCount));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
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

  // Browsers block synthetic Ctrl+F, so the button explains the shortcut instead
  // of pretending to open the find bar.
  const handleSearch = () => {
    setShowSearchHint((prev) => !prev);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  // Build iframe URL with page fragment (supported by the browser's PDF viewer)
  const buildIframeSrc = (pageNum: number) => {
    return previewUrl ? `${previewUrl}#page=${pageNum}` : undefined;
  };

  // Generate array of page numbers for all-pages view
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  // Pages to render based on current batch
  const visiblePages = pages.slice(0, visiblePageCount);
  const hasMorePages = visiblePageCount < pageCount;

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
          {/* Page-based views only make sense for a document with a known page
              count that the browser paginates (PDFs). */}
          {supportsPaging && (
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
          )}
          <Button
            variant="ghost"
            size="sm"
            title="Search in document"
            onClick={handleSearch}
          >
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

      {showSearchHint && (
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            Use your browser&apos;s find shortcut (Ctrl+F / Cmd+F) to search
            inside the preview.
          </span>
        </div>
      )}

      {/* Document Preview */}
      <div ref={containerRef} className="relative bg-slate-100 min-h-[500px] flex items-center justify-center p-4">
        {previewLoading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-sm text-slate-500">Loading document preview...</p>
          </div>
        ) : previewError ? (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Failed to load document preview</p>
            <p className="text-xs text-slate-400 mt-1">Authentication or network error — try downloading instead</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download instead
            </Button>
          </div>
        ) : previewKind === "unsupported" ? (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-600">
              Preview is not available for this file type
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {documentName.split(".").pop()?.toUpperCase()} files open in a
              desktop application. Download the submission to read it, or review
              it alongside the AI findings.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download submission
            </Button>
          </div>
        ) : previewUrl ? (
          effectiveViewMode === "single" ? (
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
                    Load more pages ({visiblePageCount} of {pageCount} shown)
                  </Button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500">
              Document preview is not available
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Download the submission to view the file.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download submission
            </Button>
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
        {supportsPaging && effectiveViewMode === "single" && (
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
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {supportsPaging && effectiveViewMode === "all" && (
          <span className="text-sm text-slate-600">
            Showing {visiblePageCount} of {pageCount} pages
          </span>
        )}
      </div>
    </div>
  );
}
