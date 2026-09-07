"use client";

import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Upload,
  User,
  LogOut,
  Shield,
  ClipboardList,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";

interface SidebarProps {
  role: UserRole;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, userName, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const advisorLinks = [
    { href: "/advisor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/advisor/documents", label: "Documents", icon: FileText },
    {
      href: "/advisor/documents/upload",
      label: "Upload",
      icon: Upload,
    },
    { href: "/advisor/profile", label: "Profile", icon: User },
  ];

  const officerLinks = [
    { href: "/officer", label: "Dashboard", icon: LayoutDashboard },
    {
      href: "/officer/submissions",
      label: "Submissions",
      icon: ClipboardList,
    },
    { href: "/officer/profile", label: "Profile", icon: User },
  ];

  const links = role === "ADVISOR" ? advisorLinks : officerLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col",
          "transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-slate-900" />
            <span className="font-semibold text-slate-900">
              Compliance Review
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600">
                {getInitials(userName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {role.toLowerCase()}
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
