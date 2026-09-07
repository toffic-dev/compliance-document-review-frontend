"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUploader } from "@/components/documents/FileUploader";

export default function UploadDocument() {
  return (
    <DashboardLayout
      role="ADVISOR"
      userName="Alex Johnson"
      title="Upload Document"
      subtitle="Submit a new compliance document for review"
    >
      <div className="max-w-2xl">
        <FileUploader />
      </div>
    </DashboardLayout>
  );
}
