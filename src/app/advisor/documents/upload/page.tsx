"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUploader } from "@/components/documents/FileUploader";
import { useAuth } from "@/lib/AuthContext";

export default function UploadDocument() {
  const { user } = useAuth();
  const router = useRouter();
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  // Role check: show message then redirect if user is not an advisor
  useEffect(() => {
    if (user && user.role !== "ADVISOR") {
      const targetDashboard = user.role === "OFFICER" ? "officer" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${user.role.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(user.role === "OFFICER" ? "/officer" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (roleMismatchMessage) {
    return (
      <DashboardLayout role="ADVISOR" userName={user?.name || "Advisor"} title="Redirecting...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-lg inline-block">
              {roleMismatchMessage}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
