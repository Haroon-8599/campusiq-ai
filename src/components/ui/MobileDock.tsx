"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Scale, Bookmark, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";

export function MobileDock() {
  const pathname = usePathname();
  const selectedColleges = useCompareStore((state) => state.selectedColleges);

  const dockItems = [
    { label: "Explore", href: "/search", icon: Compass },
    { label: "Predictor", href: "/predictor", icon: Sparkles, isAI: true },
    { label: "Compare", href: "/compare", icon: Scale, count: selectedColleges.length },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="md:hidden fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_15px_35px_-5px_rgba(37,99,235,0.15),0_4px_12px_rgba(0,0,0,0.04)]">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 py-1.5 rounded-full text-[10px] font-bold transition-all",
                isActive ? "text-blue-700 bg-blue-50/80" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-4 h-4 mb-0.5", item.isAI ? "text-blue-600" : isActive ? "text-blue-700" : "text-slate-500")} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-blue-600 text-[9px] font-extrabold text-white rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
