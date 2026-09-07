"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FileUploaderProps {
  onUpload?: (file: File) => void;
}

type UploadState = "idle" | "selected" | "uploading" | "success" | "error";

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const acceptedExtensions = [".pdf", ".docx", ".xlsx"];
  const maxSize = 10 * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (
      !acceptedTypes.includes(file.type) &&
      !acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    ) {
      return "Invalid file type. Please upload a PDF, DOCX, or XLSX file.";
    }
    if (file.size > maxSize) {
      return "File size exceeds 10 MB limit.";
    }
    return null;
  };

  const handleFile = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setState("error");
      setFile(selectedFile);
      return;
    }
    setFile(selectedFile);
    setState("selected");
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    setState("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setState("success");
          onUpload?.(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemove = () => {
    setFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (state === "success") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Document uploaded
        </h3>
        <p className="text-sm text-slate-500 mb-1">{file?.name}</p>
        <p className="text-sm text-slate-600 font-medium">
          Status: Pending Review
        </p>
        <Button variant="outline" className="mt-6" onClick={handleRemove}>
          Upload Another Document
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-slate-400 bg-slate-50"
            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx"
          onChange={handleInputChange}
          className="hidden"
        />
        <Upload className="h-10 w-10 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Upload your document
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Drag and drop your file here
        </p>
        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
          Browse Files
        </Button>
        <p className="text-xs text-slate-400 mt-4">
          PDF, DOCX, XLSX • Maximum size: 10 MB
        </p>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-1">
                Please select a valid file and try again.
              </p>
            </div>
          </div>
        )}

        {file && state === "selected" && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Button className="w-full mt-4" onClick={handleUpload}>
              Upload Document
            </Button>
          </div>
        )}

        {state === "uploading" && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-900">Uploading...</p>
              <p className="text-sm text-slate-500">{progress}%</p>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
