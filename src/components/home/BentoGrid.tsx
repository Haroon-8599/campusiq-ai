"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Scale, TrendingUp, Users, ArrowUpRight } from "lucide-react";

export function BentoGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          INTELLIGENT SUITE
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need to Make the Right College Decision.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Feature 1: AI Predictor */}
        <div className="md:col-span-2 p-8 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.08),0_2px_10px_rgba(0,0,0,0.02)] hover:border-blue-300 hover:shadow-[0_20px_45px_-12px_rgba(37,99,235,0.14)] transition-all duration-300 group flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 blur-[90px] pointer-events-none" />
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Deterministic Admission Intelligence
            </span>
            <h4 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
              AI College Predictor: Safe, Target, & Dream Matches
            </h4>
            <p className="text-sm text-slate-600 max-w-xl mb-6 leading-relaxed font-normal">
              Enter your rank across JEE Main, Advanced, NEET, or BITSAT. The engine reconciles
              closing cutoffs with Category quotas (OBC, SC, ST, EWS) and 50% Home State reservations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-slate-100 gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                Safe (75-99%)
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                Target (45-74%)
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                Dream (15-44%)
              </span>
            </div>
            <Link
              href="/predictor"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-all"
            >
              <span>Launch Predictor</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature 2: 3-Way Radar Comparison */}
        <div className="p-8 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.08),0_2px_10px_rgba(0,0,0,0.02)] hover:border-purple-300 hover:shadow-[0_20px_45px_-12px_rgba(139,92,246,0.14)] transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
              Multi-Metric Comparison
            </span>
            <h4 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">Side-by-Side Comparison Radar</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
              Select any 3 colleges to compare tuition costs against average salaries, research grants,
              and batch placement rates on an interactive radar matrix.
            </p>
          </div>
          <Link
            href="/compare"
            className="flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:text-purple-700 group-hover:translate-x-1 transition-all"
          >
            <span>Explore Radar</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature 3: Audited Placements */}
        <div className="p-8 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.08),0_2px_10px_rgba(0,0,0,0.02)] hover:border-sky-300 hover:shadow-[0_20px_45px_-12px_rgba(56,189,248,0.14)] transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-6 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
              Audited Placements
            </span>
            <h4 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">3-Year CTC Trend Analysis</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
              Uncover historical CTC progression, median packages, and verify recruiter visits from Google, Microsoft, Goldman Sachs, and Cisco.
            </p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:text-sky-700 group-hover:translate-x-1 transition-all"
          >
            <span>View Placements</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Large Feature 4: Community Q&A */}
        <div className="md:col-span-2 p-8 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.08),0_2px_10px_rgba(0,0,0,0.02)] hover:border-emerald-300 hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.14)] transition-all duration-300 group flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 blur-[90px] pointer-events-none" />
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Peer Discussion & Reviews
            </span>
            <h4 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
              CampusIQ Community: Unfiltered Senior Q&A
            </h4>
            <p className="text-sm text-slate-600 max-w-xl mb-6 leading-relaxed font-normal">
              Ask questions directly to verified seniors regarding hostel cleanliness, branch change
              feasibility, coding clubs, and actual placement cell responsiveness.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-slate-100 gap-3">
            <span className="text-xs font-medium text-slate-500">
              Active discussions on IIT Bombay, BITS Pilani, NIT Trichy & more
            </span>
            <Link
              href="/community"
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all"
            >
              <span>Join Discussion</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
