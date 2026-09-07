"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: CheckCircle,
      className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      iconClass: "text-emerald-500",
    },
    error: {
      icon: XCircle,
      className: "bg-red-50 border-red-200 text-red-800",
      iconClass: "text-red-500",
    },
    info: {
      icon: Info,
      className: "bg-blue-50 border-blue-200 text-blue-800",
      iconClass: "text-blue-500",
    },
  };

  const { icon: Icon, className, iconClass } = config[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg",
        "animate-in slide-in-from-top-2 fade-in duration-300",
        className
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 shrink-0", iconClass)} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info" }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
