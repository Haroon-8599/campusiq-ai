"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  ArrowRight,
  MapPin,
  Star,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Mic,
  GraduationCap,
} from "lucide-react";
import { CollegeBasic } from "@/types";
import { ScoreGauge } from "@/components/ui/ScoreGauge";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CollegeBasic[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/colleges?query=${encodeURIComponent(query)}&limit=4`);
        const data = await res.json();
        setSuggestions(data.colleges || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const categoryChips = [
    { label: "JEE", filter: "exam=JEE+Main" },
    { label: "NEET", filter: "exam=NEET" },
    { label: "MBA", filter: "course=MBA" },
    { label: "Engineering", filter: "course=B.Tech" },
    { label: "Medical", filter: "course=MBBS" },
    { label: "Design", filter: "course=Design" },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Glowing Product Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-xs font-bold text-blue-700 shadow-xs mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Gen College Discovery Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Discover Your Perfect College with{" "}
            <span className="aurora-gradient-text">AI Intelligence.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Navigate admissions with precision. CampusIQ AI predicts cutoffs, audits authentic multi-year
            placements, and recommends institutions tailored specifically to your rank and budget.
          </p>

          {/* AI Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center bg-white/90 backdrop-blur-2xl border border-slate-200/80 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 rounded-full p-2 shadow-[0_15px_40px_-10px_rgba(37,99,235,0.12),0_2px_10px_rgba(0,0,0,0.02)] transition-all">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 ml-1 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    router.push(`/search?query=${encodeURIComponent(query)}`);
                  }
                }}
                placeholder="Search by college, city, degree, or entrance exam..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />

              {/* Voice icon UI dummy */}
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors shrink-0 mr-1"
                title="Voice search available on mobile"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`);
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-xs font-bold text-white hover:opacity-95 shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all shrink-0 flex items-center gap-1.5 gloss-sweep"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[24px] p-2 shadow-2xl z-30 text-left animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Recommendations
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/college/${item.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-blue-50/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-600">
                        {item.shortName.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.city.name}, {item.state.name} • Avg: ₹{item.avgPackageLpa} LPA
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      {item.placementRate}% Placed
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Animated Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
            <span className="text-xs text-slate-500 font-semibold">Explore by:</span>
            {categoryChips.map((chip) => (
              <Link
                key={chip.label}
                href={`/search?${chip.filter}`}
                className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/80 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all shadow-xs"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Dashboard Preview (Hero Visual) */}
        <div className="relative max-w-5xl mx-auto pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: IIT Bombay */}
            <div className="p-6 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.08),0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  98% AI Match
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  NIRF #3
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">IIT Bombay (Powai)</h3>
              <p className="text-xs text-slate-500 mb-3.5">Mumbai, Maharashtra</p>
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50/80 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">Avg Package</span>
                  <span className="font-extrabold text-emerald-700">₹23.5 LPA</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">Highest CTC</span>
                  <span className="font-extrabold text-blue-700">₹1.68 Cr</span>
                </div>
              </div>
            </div>

            {/* Card 2: AI Match Score Ring (Center Elevate) */}
            <div className="p-6 rounded-[28px] bg-white/90 backdrop-blur-2xl border border-blue-200/80 shadow-[0_25px_50px_-15px_rgba(37,99,235,0.18),0_4px_16px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-300 relative md:-mt-5 flex flex-col items-center justify-center text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-extrabold text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]">
                AI MATCH INDEX
              </div>
              <ScoreGauge score={94} size={115} strokeWidth={9} sublabel="Match" />
              <h3 className="text-sm font-bold text-slate-900 mt-3 mb-1">Target Admission Zone</h3>
              <p className="text-xs text-slate-500 max-w-[200px]">
                Comfortably clears 2024 closing ranks with 50% state quota benefits.
              </p>
            </div>

            {/* Card 3: BITS Pilani */}
            <div className="p-6 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.08),0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  95% AI Match
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  NIRF #25
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">BITS Pilani Campus</h3>
              <p className="text-xs text-slate-500 mb-3.5">Pilani, Rajasthan</p>
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50/80 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">Avg Package</span>
                  <span className="font-extrabold text-emerald-700">₹20.7 LPA</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">Placement Rate</span>
                  <span className="font-extrabold text-slate-800">96.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
