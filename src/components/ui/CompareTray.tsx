"use client";

import React from "react";
import Link from "next/link";
import { X, Scale, ArrowRight, Trash2 } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export function CompareTray() {
  const { selectedColleges, removeCollege, clearCompare } = useCompareStore();

  if (selectedColleges.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-6 fade-in duration-300">
      <div className="pointer-events-auto w-full max-w-2xl bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(37,99,235,0.15),0_4px_16px_rgba(0,0,0,0.04)] rounded-[24px] p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                Compare Tray ({selectedColleges.length}/3)
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                • Max 3 institutions
              </span>
            </div>
          </div>
        </div>

        {/* Selected College Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {selectedColleges.map((college) => (
            <div
              key={college.id}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shrink-0"
            >
              <span className="max-w-[120px] truncate">{college.shortName}</span>
              <button
                onClick={() => removeCollege(college.id)}
                className="w-4 h-4 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all gloss-sweep"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
