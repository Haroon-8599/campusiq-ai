"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, Compass, Scale, Calculator, ArrowRight, HelpCircle } from "lucide-react";

export function AIAssistantWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = [
    {
      title: "Predict Admissions",
      desc: "Simulate JoSAA cutoffs with your rank",
      icon: Calculator,
      href: "/predictor",
      badge: "AI Tool",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Top IITs & NITs",
      desc: "Filter premier institutes by average CTC",
      icon: Compass,
      href: "/search?collegeType=IIT",
      badge: "Trending",
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Compare 3 Colleges",
      desc: "Side-by-side ROI & placement radar",
      icon: Scale,
      href: "/compare",
      badge: "Matrix",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Senior Q&A",
      desc: "Ask questions on cutoffs & hostel life",
      icon: HelpCircle,
      href: "/community",
      badge: "Community",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Dialog */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-[28px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_20px_50px_-15px_rgba(37,99,235,0.2),0_4px_20px_rgba(0,0,0,0.06)] p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">CampusIQ Assistant</h4>
                <p className="text-[10px] text-slate-500">Quick intelligence shortcuts</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {suggestions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white border border-slate-200 text-slate-600">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9px]">⌘K</kbd> anywhere for instant global search
            </span>
          </div>
        </div>
      )}

      {/* Floating Orb Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4),0_0_15px_rgba(56,189,248,0.3)] transition-all hover:scale-105 active:scale-95"
        title="AI Assistant Suggestions"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-wide">AI Assistant</span>
      </button>
    </div>
  );
}
