"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Sparkles,
  Bookmark,
  Scale,
  Compass,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building2,
  TrendingUp,
  User,
  GraduationCap,
  Award,
} from "lucide-react";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { formatLPA, formatINR } from "@/lib/utils";
import { CollegeBasic } from "@/types";

export default function DashboardPage() {
  const [data, setData] = useState<{
    user: any;
    savedCount: number;
    bookmarks: any[];
    recommendations: CollegeBasic[];
    completionScore: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-medium text-slate-500">Loading student cockpit...</p>
      </div>
    );
  }

  const milestones = [
    { title: "JEE Advanced Result & Rank Card", date: "June 09, 2026", status: "Completed" },
    { title: "JoSAA Counseling Registration & Choice Filling", date: "June 14, 2026", status: "Active" },
    { title: "Round 1 Seat Allocation & Document Verification", date: "June 20, 2026", status: "Upcoming" },
    { title: "CSAB Special Vacancy Round", date: "July 28, 2026", status: "Upcoming" },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-[32px] glass-card-light border border-white/90 shadow-[0_12px_40px_rgba(37,99,235,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 via-indigo-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              STUDENT COCKPIT
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
              Profile Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome back, {data?.user?.name || "Student"}!
          </h1>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Your personalized admission discovery hub. Track your JoSAA counseling timeline, saved dream colleges, and real-time AI placement predictions.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            href="/predictor"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-[0_6px_20px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Admissions</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 border border-slate-200/80 hover:bg-white text-xs font-bold text-slate-700 shadow-xs transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: Profile Readiness Gauge */}
        <div className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-between text-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              PROFILE COMPLETION
            </h3>
            <ScoreGauge score={data?.completionScore || 80} size={110} strokeWidth={8} sublabel="Ready" />
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
            {data?.completionScore === 100
              ? "Your academic profile is 100% complete for optimal JoSAA simulations."
              : "Add your 10th/12th percentages and branch preferences to boost accuracy."}
          </p>
          <Link
            href="/profile"
            className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Update Credentials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Widget 2: Saved Colleges Counter */}
        <div className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 block mb-1">
              {data?.savedCount || 0}
            </span>
            <h4 className="text-sm font-bold text-slate-800 mb-1">Shortlisted Colleges</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Organized into Dream, Shortlisted, Applied, and Visited categories.
            </p>
          </div>
          <Link
            href="/saved"
            className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Saved</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Widget 3: JoSAA Counseling Timeline */}
        <div className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ADMISSION TIMELINE
            </h4>
          </div>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <span className="font-semibold text-slate-800 block">{m.title}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{m.date}</span>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    m.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : m.status === "Active"
                      ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommended Colleges for You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Recommended for Your Profile</h3>
            </div>
            <p className="text-xs text-slate-500">
              Curated based on academic rankings, high placement ROI, and preferred states.
            </p>
          </div>
          <Link href="/search" className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
            Browse All 1,000+ Colleges →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.recommendations?.map((col) => (
            <div
              key={col.id}
              className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {col.placementRate}% Placement Rate
                  </span>
                  <span className="text-xs font-bold text-blue-700">
                    NIRF #{col.nirfRank || "Top Tier"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1 leading-snug">{col.name}</h4>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  {col.city?.name}, {col.state?.name}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Average CTC</span>
                    <span className="font-bold text-emerald-600">{formatLPA(col.avgPackageLpa)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Tuition Fees</span>
                    <span className="font-bold text-slate-700">{formatINR(col.feesMin)}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/college/${col.slug}`}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-blue-50 hover:border-blue-200 text-xs font-bold text-slate-700 hover:text-blue-600 text-center transition-all shadow-xs"
              >
                View Full Analysis
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
