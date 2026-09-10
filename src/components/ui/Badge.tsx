import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "violet" | "emerald" | "amber" | "cyan" | "outline";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = "blue", className, icon }: BadgeProps) {
  const variantStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200/80 shadow-xs",
    violet: "bg-purple-50 text-purple-700 border-purple-200/80 shadow-xs",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs",
    amber: "bg-gradient-to-r from-amber-50 to-amber-100/90 text-amber-900 border-amber-300/80 shadow-xs font-semibold",
    cyan: "bg-sky-50 text-sky-700 border-sky-200/80 shadow-xs",
    outline: "bg-white/80 text-slate-700 border-slate-200/90 shadow-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tracking-tight",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export function AIBadge({ matchPercentage, className }: { matchPercentage: number; className?: string }) {
  const isHigh = matchPercentage >= 85;
  const isMedium = matchPercentage >= 70 && matchPercentage < 85;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs",
        isHigh
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-200 shadow-[0_2px_8px_rgba(16,185,129,0.12)]"
          : isMedium
          ? "bg-gradient-to-r from-blue-50 to-sky-50 text-blue-800 border-blue-200 shadow-[0_2px_8px_rgba(37,99,235,0.1)]"
          : "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border-purple-200 shadow-[0_2px_8px_rgba(139,92,246,0.1)]",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{matchPercentage}% AI Match</span>
    </div>
  );
}
