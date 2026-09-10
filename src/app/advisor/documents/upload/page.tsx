"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUploader } from "@/components/documents/FileUploader";
import { useAuth } from "@/lib/AuthContext";

export default function UploadDocument() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      role="ADVISOR"
      userName={user?.name || "Advisor"}
      title="Upload Document"
      subtitle="Submit a new compliance document for review"
    >
      <div className="max-w-2xl">
        <FileUploader advisorId={user?.id} />
      </div>
    </DashboardLayout>
  );
}
