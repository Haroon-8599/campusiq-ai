"use client";

import React, { useState } from "react";
import { Star, ThumbsUp, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { ReviewItem } from "@/types";
import { useSession } from "next-auth/react";
import { formatNumber } from "@/lib/utils";

interface CollegeReviewsProps {
  collegeId: string;
  reviews: ReviewItem[];
  overallRating: number;
}

export function CollegeReviews({ collegeId, reviews: initialReviews, overallRating }: CollegeReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newPros, setNewPros] = useState("");
  const [newCons, setNewCons] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleHelpfulClick = async (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );

    try {
      await fetch(`/api/reviews/${reviewId}/vote`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPros.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId,
          rating: newRating,
          academicRating: newRating,
          infrastructureRating: newRating,
          campusLifeRating: newRating,
          placementRating: newRating,
          title: newTitle,
          pros: newPros,
          cons: newCons || "None specified.",
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setReviews([created, ...reviews]);
        setShowAddModal(false);
        setNewTitle("");
        setNewPros("");
        setNewCons("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top summary banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[24px] bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-xs gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-50 to-amber-100 border border-amber-200 flex flex-col items-center justify-center shadow-xs">
            <span className="text-2xl font-extrabold text-amber-700">{overallRating.toFixed(1)}</span>
            <div className="flex text-amber-500 text-[10px]">
              {"★".repeat(Math.round(overallRating))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Student & Alumni Insights</h4>
            <p className="text-xs text-slate-500">
              Based on {formatNumber(reviews.length)} verified student submissions and graduation logs
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all flex items-center gap-1.5 gloss-sweep"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Submission Form */}
      {showAddModal && (
        <form
          onSubmit={handleCreateReview}
          className="p-6 rounded-[24px] bg-white border border-blue-200 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Share Your Campus Experience</h4>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`text-xl transition-transform hover:scale-125 ${
                    star <= newRating ? "text-amber-400" : "text-slate-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Headline</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. World-class faculty and cutting-edge research labs"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-emerald-700 block mb-1">Pros (What you loved)</label>
              <textarea
                required
                rows={3}
                value={newPros}
                onChange={(e) => setNewPros(e.target.value)}
                placeholder="Placements, coding culture, campus fests, professors..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-rose-700 block mb-1">Cons (Areas for improvement)</label>
              <textarea
                rows={3}
                value={newCons}
                onChange={(e) => setNewCons(e.target.value)}
                placeholder="Hostel mess food, strict attendance policies..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "Publishing..." : "Publish Review"}</span>
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-[24px] bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-blue-200 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                  {rev.user?.name?.[0] || "S"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {rev.user?.name || "Verified Student"}
                    </span>
                    {rev.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{rev.rating.toFixed(1)}</span>
              </div>
            </div>

            <h5 className="text-xs font-bold text-slate-900 mb-2">{rev.title}</h5>

            <div className="space-y-1.5 text-xs text-slate-700">
              <p>
                <span className="font-bold text-emerald-700">Pros: </span>
                {rev.pros}
              </p>
              {rev.cons && (
                <p>
                  <span className="font-bold text-rose-700">Cons: </span>
                  {rev.cons}
                </p>
              )}
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <button
                onClick={() => handleHelpfulClick(rev.id)}
                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors font-medium"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
