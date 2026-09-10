"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Scale,
  Star,
  MapPin,
  Check,
  Building2,
  ExternalLink,
  Award,
} from "lucide-react";
import { CollegeBasic } from "@/types";
import { Badge, AIBadge } from "@/components/ui/Badge";
import { formatLPA, formatINR, cn } from "@/lib/utils";
import { useCompareStore } from "@/store/compareStore";

interface CollegeCardProps {
  college: CollegeBasic;
  onBookmarkToggle?: (collegeId: string) => void;
  isBookmarked?: boolean;
}

export function CollegeCard({
  college,
  onBookmarkToggle,
  isBookmarked = false,
}: CollegeCardProps) {
  const { addCollege, removeCollege, isComparing } = useCompareStore();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const comparing = isComparing(college.id);

  const matchScore =
    college.matchScore ||
    Math.min(
      99,
      Math.max(
        68,
        Math.round(
          (college.overallRating / 5) * 45 +
            Math.min(45, (college.avgPackageLpa / 25) * 45) +
            (college.nirfRank && college.nirfRank <= 50 ? 10 : 0)
        )
      )
    );

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparing) {
      removeCollege(college.id);
    } else {
      addCollege(college);
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);

    if (onBookmarkToggle) {
      onBookmarkToggle(college.id);
      return;
    }

    try {
      await fetch("/api/bookmarks", {
        method: bookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
    } catch (err) {
      console.error("Bookmark update error:", err);
    }
  };

  return (
    <div className="group relative bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] p-5 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] hover:border-blue-200/90 hover:shadow-[0_20px_45px_-12px_rgba(37,99,235,0.15),0_6px_18px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
      {/* Top subtle gloss highlight */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <AIBadge matchPercentage={matchScore} />

          <div className="flex items-center gap-1.5">
            {college.nirfRank && (
              <Badge variant="amber" icon={<Award className="w-3 h-3 text-amber-700" />}>
                NIRF #{college.nirfRank}
              </Badge>
            )}
            <Badge variant="outline">{college.collegeType}</Badge>
          </div>
        </div>

        {/* College Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-50 to-blue-50/50 border border-slate-200/80 p-1.5 shrink-0 flex items-center justify-center overflow-hidden shadow-xs group-hover:border-blue-300 transition-colors">
            {college.logoUrl ? (
              <img
                src={college.logoUrl}
                alt={college.shortName}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/college/${college.slug}`}
              className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block tracking-tight"
            >
              {college.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {college.city?.name}, {college.state?.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {college.overallRating.toFixed(1)} ({college.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 mb-4">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Average CTC</span>
            <span className="text-sm font-extrabold text-emerald-700">
              {formatLPA(college.avgPackageLpa)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Highest CTC</span>
            <span className="text-sm font-extrabold text-blue-700">
              {formatLPA(college.highestPackageLpa)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Annual Tuition</span>
            <span className="text-xs font-bold text-slate-800">
              {formatINR(college.feesMin)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Placement Rate</span>
            <span className="text-xs font-bold text-slate-800">
              {college.placementRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 gap-2">
        <button
          onClick={handleCompareClick}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
            comparing
              ? "bg-blue-50 text-blue-700 border-blue-300 shadow-xs"
              : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300"
          )}
        >
          {comparing ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Scale className="w-3.5 h-3.5" />}
          <span>{comparing ? "Comparing" : "Compare"}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBookmarkClick}
            className={cn(
              "p-2 rounded-xl border transition-all",
              bookmarked
                ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                : "bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:border-slate-300"
            )}
            title={bookmarked ? "Saved" : "Save College"}
          >
            <Bookmark className={cn("w-3.5 h-3.5", bookmarked && "fill-purple-600 text-purple-600")} />
          </button>

          <Link
            href={`/college/${college.slug}`}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span>Explore</span>
            <ExternalLink className="w-3 h-3 text-blue-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
