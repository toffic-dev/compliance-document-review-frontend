"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getInitials } from "@/lib/utils";
import { User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/AuthContext";

export default function OfficerProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  // Role check: wait for auth to load, then verify role
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "OFFICER") {
      const targetDashboard = user.role === "ADVISOR" ? "advisor" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${user.role.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(user.role === "ADVISOR" ? "/advisor" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

  if (roleMismatchMessage) {
    return (
      <DashboardLayout role="OFFICER" userName={user?.name || "Officer"} title="Redirecting...">
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
      role="OFFICER"
      userName={user?.name || "Officer"}
      title="Profile"
      subtitle="Manage your account settings"
    >
      <div className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-xl font-semibold text-slate-600">
                {getInitials(user?.name || "Officer")}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {user?.name || "Officer"}
              </h3>
              <p className="text-sm text-slate-500">Compliance Officer</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              defaultValue={user?.name || ""}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              defaultValue={user?.email || ""}
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              id="role"
              label="Role"
              defaultValue="Compliance Officer"
              icon={<Shield className="h-4 w-4" />}
              disabled
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
