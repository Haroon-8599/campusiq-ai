"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Plus,
  X,
  Share2,
  Download,
  Building2,
  Check,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { CollegeBasic } from "@/types";
import { CompareRadar } from "@/components/college/CompareRadar";
import { formatINR, formatLPA, cn } from "@/lib/utils";

export default function ComparePage() {
  const { selectedColleges, removeCollege, addCollege, clearCompare } = useCompareStore();
  const [detailedColleges, setDetailedColleges] = useState<CollegeBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CollegeBasic[]>([]);
  const [copied, setCopied] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);

  useEffect(() => {
    if (selectedColleges.length === 0) {
      setDetailedColleges([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const ids = selectedColleges.map((c) => c.id).join(",");
        const res = await fetch(`/api/compare?ids=${ids}`);
        const data = await res.json();
        setDetailedColleges(data.colleges || []);
      } catch (err) {
        console.error("Compare fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedColleges]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges?query=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        setSearchResults(data.colleges || []);
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const bestPackage = Math.max(...(detailedColleges.map((c) => c.avgPackageLpa) || [0]));
  const lowestFees = Math.min(...(detailedColleges.map((c) => c.feesMin) || [Infinity]));
  const bestRating = Math.max(...(detailedColleges.map((c) => c.overallRating) || [0]));
  const bestNirf = Math.min(...(detailedColleges.map((c) => c.nirfRank || Infinity) || [Infinity]));

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 print:pt-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              COLLEGE COMPARISON MATRIX
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">
              {selectedColleges.length} / 3 Selected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Side-by-Side College Evaluation
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {detailedColleges.length > 1 && (
            <button
              onClick={() => setDiffOnly(!diffOnly)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors shadow-xs",
                diffOnly
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Differences Only</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{copied ? "Link Copied!" : "Share Link"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {selectedColleges.length === 0 && (
        <div className="p-12 text-center rounded-[28px] bg-white/80 border border-slate-200 max-w-lg mx-auto shadow-xs">
          <Scale className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 mb-2">No colleges selected to compare</h3>
          <p className="text-xs text-slate-600 mb-6 font-normal leading-relaxed">
            Add up to 3 colleges from the College Explorer or click the button below to start comparing.
          </p>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors inline-flex items-center gap-1.5 shadow-sm gloss-sweep"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Colleges to Compare</span>
          </button>
        </div>
      )}

      {selectedColleges.length > 0 && (
        <div className="space-y-8">
          {/* Top Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {detailedColleges.map((col) => (
              <div
                key={col.id}
                className="p-5 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06)] relative group"
              >
                <button
                  onClick={() => removeCollege(col.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-600">
                    {col.shortName.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{col.name}</h3>
                    <p className="text-[11px] text-slate-500">
                      {col.city?.name}, {col.state?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/college/${col.slug}`}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Full Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Add college slot if < 3 */}
            {selectedColleges.length < 3 && (
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-6 rounded-[28px] border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white/60 hover:bg-blue-50/40 flex flex-col items-center justify-center text-center transition-all group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 mb-2 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                  Add Another College ({3 - selectedColleges.length} remaining)
                </span>
              </button>
            )}
          </div>

          {/* Interactive Radar Chart Section */}
          <div className="p-7 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Comparative Radar Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Multidimensional benchmark across Academics, Placement CTC, Infrastructure, ROI, and Campus Brand.
                </p>
              </div>
            </div>
            <CompareRadar colleges={detailedColleges} />
          </div>

          {/* Feature-by-Feature Comparison Matrix Table */}
          <div className="rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 overflow-hidden shadow-[0_15px_35px_-10px_rgba(37,99,235,0.06)]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Side-by-Side Detailed Metrics</h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                * Highlighted in emerald indicates leading metric
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold w-1/4">Metric</th>
                    {detailedColleges.map((c) => (
                      <th key={c.id} className="p-4 font-extrabold text-slate-900">
                        {c.shortName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {/* NIRF Rank */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">NIRF National Rank</td>
                    {detailedColleges.map((c) => (
                      <td
                        key={c.id}
                        className={cn(
                          "p-4 font-extrabold",
                          c.nirfRank && c.nirfRank === bestNirf ? "text-emerald-700 bg-emerald-50/40" : "text-slate-900"
                        )}
                      >
                        {c.nirfRank ? `#${c.nirfRank}` : "Unranked"}
                      </td>
                    ))}
                  </tr>

                  {/* Average CTC */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Average Placement Package</td>
                    {detailedColleges.map((c) => (
                      <td
                        key={c.id}
                        className={cn(
                          "p-4 font-extrabold",
                          c.avgPackageLpa === bestPackage ? "text-emerald-700 bg-emerald-50/40" : "text-slate-900"
                        )}
                      >
                        {formatLPA(c.avgPackageLpa)}
                      </td>
                    ))}
                  </tr>

                  {/* Highest CTC */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Peak Placement Offer</td>
                    {detailedColleges.map((c) => (
                      <td key={c.id} className="p-4 font-extrabold text-blue-700">
                        {formatLPA(c.highestPackageLpa)}
                      </td>
                    ))}
                  </tr>

                  {/* Annual Fees */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Annual Tuition Fees</td>
                    {detailedColleges.map((c) => (
                      <td
                        key={c.id}
                        className={cn(
                          "p-4 font-extrabold",
                          c.feesMin === lowestFees ? "text-emerald-700 bg-emerald-50/40" : "text-slate-900"
                        )}
                      >
                        {formatINR(c.feesMin)}
                      </td>
                    ))}
                  </tr>

                  {/* Placement Rate */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Batch Placement Rate</td>
                    {detailedColleges.map((c) => (
                      <td key={c.id} className="p-4 font-bold text-slate-900">
                        {c.placementRate}%
                      </td>
                    ))}
                  </tr>

                  {/* Overall Rating */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Student Rating</td>
                    {detailedColleges.map((c) => (
                      <td
                        key={c.id}
                        className={cn(
                          "p-4 font-extrabold",
                          c.overallRating === bestRating ? "text-amber-700 bg-amber-50/30" : "text-slate-900"
                        )}
                      >
                        ★ {c.overallRating.toFixed(1)} / 5 ({c.reviewCount})
                      </td>
                    ))}
                  </tr>

                  {/* Campus Area */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Campus Size</td>
                    {detailedColleges.map((c) => (
                      <td key={c.id} className="p-4 text-slate-800">
                        {c.campusSizeAcres} Acres
                      </td>
                    ))}
                  </tr>

                  {/* Hostel */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Hostel Facilities</td>
                    {detailedColleges.map((c) => (
                      <td key={c.id} className="p-4 text-slate-800 font-semibold">
                        {c.hostelAvailable ? "Available (Hostel + Mess)" : "Day Scholar Only"}
                      </td>
                    ))}
                  </tr>

                  {/* Accreditation */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500">Accreditation</td>
                    {detailedColleges.map((c) => (
                      <td key={c.id} className="p-4 font-bold text-blue-700">
                        NAAC {c.naacRating || "A Grade"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add College Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Add College to Comparison</h3>
              <button onClick={() => setSearchModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name or city... (e.g. BITS, NIT, Delhi)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {searchResults.map((col) => (
                <div key={col.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{col.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {col.city?.name} • Avg: ₹{col.avgPackageLpa} LPA
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addCollege(col);
                      setSearchModalOpen(false);
                      setSearchQuery("");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
