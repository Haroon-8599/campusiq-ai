"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  MapPin,
  Building2,
  FolderHeart,
} from "lucide-react";
import { CollegeBasic } from "@/types";
import { formatINR, formatLPA, cn } from "@/lib/utils";

interface BookmarkItem {
  id: string;
  collection: "DREAM" | "SHORTLISTED" | "APPLIED" | "VISITED" | "COMPARE_LATER";
  notes?: string;
  college: CollegeBasic;
}

export default function SavedCollegesPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState<string>("ALL");

  useEffect(() => {
    async function loadBookmarks() {
      setLoading(true);
      try {
        const res = await fetch("/api/bookmarks");
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBookmarks();
  }, []);

  const handleRemove = async (collegeId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.college.id !== collegeId));
    try {
      await fetch(`/api/bookmarks?collegeId=${collegeId}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  const collections = [
    { id: "ALL", label: "All Saved" },
    { id: "DREAM", label: "Dream Colleges" },
    { id: "SHORTLISTED", label: "Shortlisted" },
    { id: "APPLIED", label: "Applied" },
    { id: "VISITED", label: "Visited" },
    { id: "COMPARE_LATER", label: "Compare Later" },
  ];

  const filteredBookmarks =
    activeCollection === "ALL"
      ? bookmarks
      : bookmarks.filter((b) => b.collection === activeCollection);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              SAVED COLLECTIONS
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-bold">
              {bookmarks.length} Institutions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved & Shortlisted Colleges
          </h1>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl glass-card-light border border-white/90 text-xs font-bold text-slate-700 hover:text-blue-600 hover:shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export Shortlist</span>
        </button>
      </div>

      {/* Collection Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-200/80 no-scrollbar">
        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveCollection(col.id)}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
              activeCollection === col.id
                ? "bg-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                : "text-slate-600 hover:text-slate-900 bg-white/70 border border-slate-200/60 hover:bg-white"
            )}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium text-slate-500">Loading your saved colleges...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBookmarks.length === 0 && (
        <div className="p-12 text-center rounded-[28px] glass-card-light border border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.03)] max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center mx-auto mb-3 text-blue-600">
            <FolderHeart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No colleges in this collection</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Click the bookmark icon on any college card in the Explorer or Predictor to save it here.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <span>Explore Colleges</span>
          </Link>
        </div>
      )}

      {/* Grid */}
      {!loading && filteredBookmarks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map(({ college, collection, notes }) => (
            <div
              key={college.id}
              className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                    {collection}
                  </span>
                  <button
                    onClick={() => handleRemove(college.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100/70 border border-blue-200/80 flex items-center justify-center font-extrabold text-xs text-blue-700 shrink-0 shadow-xs">
                    {college.shortName.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">{college.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {college.city?.name}, {college.state?.name}
                    </p>
                  </div>
                </div>

                {notes && (
                  <p className="text-xs text-slate-600 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 mb-4 italic leading-relaxed">
                    "{notes}"
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Average CTC</span>
                    <span className="font-bold text-emerald-600">{formatLPA(college.avgPackageLpa)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Annual Tuition</span>
                    <span className="font-bold text-slate-700">{formatINR(college.feesMin)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">
                  {college.nirfRank ? `NIRF #${college.nirfRank}` : "Accredited"}
                </span>
                <Link
                  href={`/college/${college.slug}`}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
