"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { MobileDock } from "@/components/ui/MobileDock";
import { CompareTray } from "@/components/ui/CompareTray";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F8FBFF] text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 aurora-bg-light">
      <Navbar onOpenCommandPalette={() => setCmdOpen(true)} />
      <main className="flex-1 w-full relative z-10">{children}</main>
      <CompareTray />
      <MobileDock />
      <AIAssistantWidget />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
