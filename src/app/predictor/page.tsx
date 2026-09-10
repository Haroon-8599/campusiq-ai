"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  TrendingUp,
  MapPin,
  ExternalLink,
  RotateCcw,
  Zap,
  Target,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { PredictorResult } from "@/types";
import { formatINR, formatLPA, cn } from "@/lib/utils";
import { ScoreGauge } from "@/components/ui/ScoreGauge";

export default function PredictorPage() {
  // Input states
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState<number | "">("");
  const [category, setCategory] = useState("General");
  const [homeState, setHomeState] = useState("Delhi");
  const [gender, setGender] = useState("All");
  const [preferredBranch, setPreferredBranch] = useState("");
  const [budget, setBudget] = useState<number | "">("");

  // Output states
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    safe: PredictorResult[];
    target: PredictorResult[];
    dream: PredictorResult[];
    totalEvaluated: number;
  } | null>(null);

  const [activeTierTab, setActiveTierTab] = useState<"safe" | "target" | "dream">("safe");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || Number(rank) <= 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          category,
          homeState,
          gender,
          preferredBranch: preferredBranch || undefined,
          budget: budget ? Number(budget) : undefined,
        }),
      });

      const data = await res.json();
      setResults(data);
      // Default to target or safe if populated
      if (data.safe?.length > 0) setActiveTierTab("safe");
      else if (data.target?.length > 0) setActiveTierTab("target");
      else setActiveTierTab("dream");
    } catch (err) {
      console.error("Predictor evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const examsList = ["JEE Main", "JEE Advanced", "BITSAT", "GATE", "CAT", "CUET"];
  const categoriesList = ["General", "OBC-NCL", "SC", "ST", "EWS"];
  const statesList = [
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "West Bengal",
    "Rajasthan",
    "Gujarat",
    "Kerala",
    "Punjab",
    "Madhya Pradesh",
    "Bihar",
    "Odisha",
    "Andhra Pradesh",
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-700 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Deterministic Admission Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          AI College Predictor
        </h1>
        <p className="text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
          Input your entrance exam rank, category reservation, and home state quota to simulate JoSAA & CSAB
          counseling cutoffs with transparent confidence scoring.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-[28px] glass-card-light border border-white/90 shadow-[0_12px_40px_rgba(37,99,235,0.07)] mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Exam & Rank */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Entrance Exam
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              >
                {examsList.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Your Exam All-India Rank / Percentile
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 4500"
                value={rank}
                onChange={(e) => setRank(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Row 2: Category & Home State & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Category Quota
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Home State (50% Quota)
              </label>
              <select
                value={homeState}
                onChange={(e) => setHomeState(e.target.value)}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              >
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Gender Quota
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              >
                <option value="All">Gender-Neutral</option>
                <option value="Female">Female Supernumerary</option>
              </select>
            </div>
          </div>

          {/* Row 3: Preferred Branch & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Preferred Specialization / Branch (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science, Artificial Intelligence"
                value={preferredBranch}
                onChange={(e) => setPreferredBranch(e.target.value)}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Maximum Annual Tuition Budget (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 300000"
                value={budget}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-sm font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simulate Admissions & Match Colleges</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {/* Summary Banner */}
          <div className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_8px_32px_rgba(37,99,235,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Prediction Analysis Complete</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Evaluated against {results.totalEvaluated} branch-level cutoffs for Rank #{Number(rank).toLocaleString()} ({exam})
              </p>
            </div>

            {/* Classification Tabs */}
            <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setActiveTierTab("safe")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  activeTierTab === "safe"
                    ? "bg-white text-emerald-700 shadow-sm border border-emerald-200/60 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe ({results.safe.length})</span>
              </button>
              <button
                onClick={() => setActiveTierTab("target")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  activeTierTab === "target"
                    ? "bg-white text-blue-700 shadow-sm border border-blue-200/60 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Target ({results.target.length})</span>
              </button>
              <button
                onClick={() => setActiveTierTab("dream")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  activeTierTab === "dream"
                    ? "bg-white text-purple-700 shadow-sm border border-purple-200/60 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Dream ({results.dream.length})</span>
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results[activeTierTab]?.map((res, index) => (
              <div
                key={`${res.college.id}_${res.course.id}_${index}`}
                className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border",
                            res.tier === "Safe"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : res.tier === "Target"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          )}
                        >
                          {res.tier} Choice
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {res.confidenceScore}% Confidence
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">{res.college.name}</h4>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">{res.course.name}</p>
                    </div>

                    <div className="shrink-0 text-center">
                      <ScoreGauge score={res.probability} size={70} strokeWidth={6} sublabel="Chance" />
                    </div>
                  </div>

                  {/* AI Decision Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2 mb-4">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {res.decisionSummary}
                    </p>
                    <div className="space-y-1 pt-2 border-t border-slate-200/60">
                      {res.matchReasons.map((reason, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer metrics */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Average Package</span>
                    <span className="font-bold text-emerald-600">
                      {formatLPA(res.college.avgPackageLpa)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Annual Tuition</span>
                    <span className="font-bold text-slate-700">
                      {formatINR(res.course.annualTuition)}
                    </span>
                  </div>
                  <Link
                    href={`/college/${res.college.slug}`}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Explore College</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {results[activeTierTab]?.length === 0 && (
            <div className="p-12 text-center rounded-[28px] glass-card-light border border-white/90 max-w-md mx-auto">
              <p className="text-xs text-slate-500 font-medium">
                No institutions in this tier for the specified rank. Check the other categories above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
