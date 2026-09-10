"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Globe,
  Award,
  Star,
  Bookmark,
  Scale,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  CloudSun,
  Share2,
} from "lucide-react";
import { CollegeDetail, CollegeBasic } from "@/types";
import { Badge, AIBadge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { PlacementCharts } from "@/components/college/PlacementCharts";
import { CollegeReviews } from "@/components/college/CollegeReviews";
import { formatINR, formatLPA } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";

export default function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addCollege, removeCollege, isComparing } = useCompareStore();
  const [data, setData] = useState<{ college: CollegeDetail; similarColleges: CollegeBasic[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "recruiters" | "reviews" | "scholarships" | "faqs">("overview");
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/colleges/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Detail fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-medium">Loading comprehensive college profile...</p>
      </div>
    );
  }

  if (!data?.college) {
    return (
      <div className="pt-36 pb-20 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">College Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested college profile could not be located.</p>
        <Link href="/search" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
          Back to Explorer
        </Link>
      </div>
    );
  }

  const { college, similarColleges } = data;
  const comparing = isComparing(college.id);

  const campusIQScore = Math.min(
    99,
    Math.round(
      (college.overallRating / 5) * 35 +
        Math.min(35, (college.avgPackageLpa / 24) * 35) +
        (college.placementRate / 100) * 20 +
        (college.nirfRank && college.nirfRank <= 30 ? 10 : 5)
    )
  );

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: `Degrees & Cutoffs (${college.courses?.length || 0})` },
    { id: "placements", label: "Placement CTC Trends" },
    { id: "recruiters", label: "Top Recruiters" },
    { id: "scholarships", label: `Scholarships (${college.scholarships?.length || 0})` },
    { id: "reviews", label: `Student Reviews (${college.reviewCount})` },
    { id: "faqs", label: "Admissions FAQs" },
  ];

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4">
      {/* Banner & Hero Header */}
      <div className="relative rounded-[32px] overflow-hidden border border-slate-200/80 mb-8 bg-white/85 backdrop-blur-xl shadow-[0_15px_40px_-15px_rgba(37,99,235,0.08)]">
        {/* Banner image with soft light overlay */}
        <div className="h-60 sm:h-80 w-full relative">
          <img
            src={college.bannerUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200"}
            alt={college.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        {/* Hero Info Overlay */}
        <div className="relative p-6 sm:p-8 -mt-24 sm:-mt-28 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo */}
            <div className="w-24 h-24 rounded-[22px] bg-white border-2 border-white p-2 shadow-xl backdrop-blur-xl shrink-0 flex items-center justify-center">
              {college.logoUrl ? (
                <img
                  src={college.logoUrl}
                  alt={college.shortName}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <Building2 className="w-10 h-10 text-blue-600" />
              )}
            </div>

            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {college.nirfRank && (
                  <Badge variant="amber" icon={<Award className="w-3.5 h-3.5 text-amber-700" />}>
                    NIRF Rank #{college.nirfRank}
                  </Badge>
                )}
                {college.naacRating && (
                  <Badge variant="emerald">NAAC {college.naacRating}</Badge>
                )}
                <Badge variant="outline">{college.ownership} {college.collegeType}</Badge>
                <AIBadge matchPercentage={campusIQScore} />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {college.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {college.city?.name}, {college.state?.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Est. {college.establishedYear}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-800 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {college.overallRating.toFixed(1)} / 5 ({college.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save, Compare, Share, Apply */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (comparing) removeCollege(college.id);
                else addCollege(college);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                comparing
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{comparing ? "In Compare Tray" : "Add to Compare"}</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-xl border transition-all shadow-xs ${
                bookmarked
                  ? "bg-purple-50 text-purple-700 border-purple-300"
                  : "bg-white text-slate-400 border-slate-200 hover:text-slate-700"
              }`}
              title="Bookmark College"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-purple-600 text-purple-600" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all gloss-sweep"
              >
                <span>Apply / Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-t border-slate-100 bg-slate-50/60">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Average CTC</span>
            <span className="text-lg font-extrabold text-emerald-700">
              {formatLPA(college.avgPackageLpa)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Peak Highest Package</span>
            <span className="text-lg font-extrabold text-blue-700">
              {formatLPA(college.highestPackageLpa)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Annual Tuition Fees</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatINR(college.feesMin)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Campus Size & Hostels</span>
            <span className="text-lg font-extrabold text-slate-900">
              {college.campusSizeAcres} Acres • {college.hostelAvailable ? "Hostel" : "Day Scholar"}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-20 z-30 mb-8 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto shadow-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Tab Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Institution Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {college.overview}
                </p>
              </div>

              {/* Placement Snapshot */}
              <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Placement & Salary Growth
                  </h3>
                  <button
                    onClick={() => setActiveTab("placements")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View detailed trends →
                  </button>
                </div>
                <PlacementCharts placements={college.placements || []} />
              </div>
            </div>
          )}

          {/* TAB 2: COURSES & CUTOFFS */}
          {activeTab === "courses" && (
            <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Undergraduate & Postgraduate Degree Programs
              </h3>
              <div className="divide-y divide-slate-100">
                {college.courses?.map((c) => (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Duration: {c.durationYears} Years • Entrance Exam:{" "}
                        <span className="text-blue-700 font-bold">{c.entranceExam}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">General Cutoff</span>
                        <span className="text-xs font-extrabold text-slate-800">
                          {c.cutoffGeneral ? `#${c.cutoffGeneral.toLocaleString()}` : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">Annual Tuition</span>
                        <span className="text-xs font-extrabold text-emerald-700">
                          {formatINR(c.annualTuition)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PLACEMENTS */}
          {activeTab === "placements" && (
            <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Historical Placement Records (2022-2024)
              </h3>
              <PlacementCharts placements={college.placements || []} />
            </div>
          )}

          {/* TAB 4: RECRUITERS */}
          {activeTab === "recruiters" && (
            <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-base font-bold text-slate-900">Prominent Recruiting Partners</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {college.recruiters?.map(({ recruiter }) => (
                  <div
                    key={recruiter.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center justify-center gap-2 shadow-xs"
                  >
                    <span className="text-xs font-bold text-slate-800">{recruiter.name}</span>
                    <span className="text-[10px] text-blue-700 px-2 py-0.5 rounded-full bg-blue-100/70 font-semibold">
                      {recruiter.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SCHOLARSHIPS */}
          {activeTab === "scholarships" && (
            <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Financial Aid & Scholarship Programs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {college.scholarships?.map((s) => (
                  <div key={s.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
                    <span className="text-xs font-bold text-purple-700 px-2 py-0.5 rounded bg-purple-50 border border-purple-200 inline-block">
                      {s.amount}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{s.eligibilityCriteria}</p>
                    {s.deadline && (
                      <span className="text-[10px] font-medium text-slate-400 block">Deadline: {s.deadline}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === "reviews" && (
            <CollegeReviews
              collegeId={college.id}
              reviews={college.reviews || []}
              overallRating={college.overallRating}
            />
          )}

          {/* TAB 7: FAQS */}
          {activeTab === "faqs" && (
            <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Admissions & Counseling FAQs
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">What is the typical closing rank for CSE?</h4>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Candidates within the top ranks ({college.courses?.[0]?.cutoffGeneral || 2500})
                    secure admission in Computer Science through JoSAA/CSAB counseling rounds.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Is hostel accommodation guaranteed for freshers?</h4>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Yes, 100% of outstation undergraduate students are allocated on-campus hostel accommodation with dining facilities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Campus Score Card */}
          <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-blue-200/80 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.1)] flex flex-col items-center text-center">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">
              CAMPUSIQ AI INDEX
            </h4>
            <ScoreGauge score={campusIQScore} size={140} strokeWidth={10} sublabel="Index" />
            <p className="text-xs text-slate-600 mt-4 leading-relaxed max-w-xs font-normal">
              Algorithmic benchmark synthesizing placement ROI, NIRF national rank, verified reviews, and research output.
            </p>
            <Link
              href="/predictor"
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] text-center transition-all gloss-sweep"
            >
              Simulate Admission Chances
            </Link>
          </div>

          {/* Campus Weather Widget (Creative Standout Feature) */}
          <div className="p-6 rounded-[28px] bg-gradient-to-tr from-sky-50 to-blue-50/60 border border-sky-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wide">Campus Weather</span>
                <h5 className="text-xs font-bold text-slate-900">{college.city.name} Climate</h5>
                <p className="text-[11px] text-slate-500">26°C • Pleasant & Breezy</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-sky-200">
              Live
            </span>
          </div>

          {/* Similar Institutions */}
          {similarColleges && similarColleges.length > 0 && (
            <div className="p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06)] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                SIMILAR INSTITUTIONS
              </h4>
              <div className="space-y-2.5">
                {similarColleges.map((sim) => (
                  <Link
                    key={sim.id}
                    href={`/college/${sim.slug}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sim.shortName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {sim.city?.name} • Avg: ₹{sim.avgPackageLpa} LPA
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">
                      NIRF #{sim.nirfRank || "—"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
