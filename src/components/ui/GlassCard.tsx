"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: "none" | "blue" | "violet" | "emerald";
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  glow = "none",
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    blue: "hover:shadow-[0_20px_45px_-12px_rgba(37,99,235,0.18)] hover:border-blue-300",
    violet: "hover:shadow-[0_20px_45px_-12px_rgba(139,92,246,0.18)] hover:border-purple-300",
    emerald: "hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.18)] hover:border-emerald-300",
  };

  return (
    <div
      className={cn(
        "glass-card-light bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300",
        hoverEffect && "hover:-translate-y-1 hover:bg-white/95 hover:border-blue-200/80 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)]",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
