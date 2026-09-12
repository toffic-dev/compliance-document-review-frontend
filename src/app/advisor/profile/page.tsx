"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getInitials } from "@/lib/utils";
import { User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/AuthContext";

export default function AdvisorProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(null);

  // Role check: wait for auth to load, then verify role
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADVISOR") {
      const targetDashboard = user.role === "OFFICER" ? "officer" : "login";
      setRoleMismatchMessage(
        `This account is registered as an ${user.role.toLowerCase()} — redirecting to ${targetDashboard} dashboard...`
      );
      const timer = setTimeout(() => {
        router.push(user.role === "OFFICER" ? "/officer" : "/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Simulate API call for updating profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="ADVISOR"
      userName={user?.name || "Advisor"}
      title="Profile"
      subtitle="Manage your account settings"
    >
      <div className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-xl font-semibold text-slate-600">
                {getInitials(user?.name || "Advisor")}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {user?.name || "Advisor"}
              </h3>
              <p className="text-sm text-slate-500">Compliance Advisor</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Personal Information
          </h3>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              id="role"
              label="Role"
              defaultValue="Advisor"
              icon={<Shield className="h-4 w-4" />}
              disabled
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
