"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Scale, GraduationCap, ArrowRight, X } from "lucide-react";
import { CollegeBasic } from "@/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CollegeBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?query=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.colleges || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15),0_0_30px_rgba(37,99,235,0.1)] overflow-hidden">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-4 h-4 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges, degrees, or cities... (e.g. IIT Bombay, CSE, Pune)"
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 border border-slate-200 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions */}
        <div className="p-2 max-h-80 overflow-y-auto">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-500">Searching 1,000+ colleges...</div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Institutions
              </div>
              {results.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    onClose();
                    router.push(`/college/${col.slug}`);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {col.shortName.slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {col.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {col.city.name}, {col.state.name} • Avg: ₹{col.avgPackageLpa} LPA
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No colleges found matching "{query}". Try searching by city or branch.
            </div>
          )}

          {!query && (
            <div className="p-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Navigation Shortcuts
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push("/predictor");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-left text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Admission Predictor</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/compare");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 text-left text-xs font-semibold text-slate-700 hover:text-purple-700 transition-all"
                >
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Compare Colleges</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/search?collegeType=IIT");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Explore Top IITs</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/search?collegeType=NIT");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-left text-xs font-semibold text-slate-700 hover:text-sky-700 transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <span>Explore Top NITs</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
