"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getInitials } from "@/lib/utils";
import { User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function OfficerProfile() {
  return (
    <DashboardLayout
      role="OFFICER"
      userName="Dr. Emily Roberts"
      title="Profile"
      subtitle="Manage your account settings"
    >
      <div className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-xl font-semibold text-slate-600">
                {getInitials("Dr. Emily Roberts")}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Dr. Emily Roberts
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
              defaultValue="Dr. Emily Roberts"
              icon={<User className="h-4 w-4" />}
            />
            <Input
              id="email"
              label="Email"
              type="email"
              defaultValue="emily.roberts@compliance.com"
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
