"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Award,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [tenth, setTenth] = useState<number | "">("");
  const [twelfth, setTwelfth] = useState<number | "">("");
  const [category, setCategory] = useState("General");
  const [gender, setGender] = useState("All");
  const [homeState, setHomeState] = useState("Delhi");
  const [budgetMax, setBudgetMax] = useState<number | "">("");
  const [preferredExams, setPreferredExams] = useState<string>("JEE Main, JEE Advanced");
  const [preferredBranches, setPreferredBranches] = useState<string>(
    "Computer Science and Engineering, Artificial Intelligence & Data Science"
  );
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.user) {
          setName(json.user.name || "");
          setEmail(json.user.email || "");
          setBio(json.user.bio || "");
          if (json.user.profile) {
            setTenth(json.user.profile.tenthPercentage || "");
            setTwelfth(json.user.profile.twelfthPercentage || "");
            setCategory(json.user.profile.category || "General");
            setGender(json.user.profile.gender || "All");
            setHomeState(json.user.profile.homeState || "Delhi");
            setBudgetMax(json.user.profile.budgetMax || "");
            setPreferredExams(json.user.profile.preferredExams?.join(", ") || "JEE Main");
            setPreferredBranches(
              json.user.profile.preferredBranches?.join(", ") ||
                "Computer Science and Engineering"
            );
            setBadges(json.user.profile.badges || ["Explorer", "Early Adopter"]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const examsArray = preferredExams
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const branchesArray = preferredBranches
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          tenthPercentage: tenth ? Number(tenth) : null,
          twelfthPercentage: twelfth ? Number(twelfth) : null,
          category,
          gender,
          homeState,
          budgetMax: budgetMax ? Number(budgetMax) : null,
          preferredExams: examsArray,
          preferredBranches: branchesArray,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Profile and counseling preferences updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 max-w-3xl mx-auto px-4 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-medium text-slate-500">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              STUDENT PROFILE
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
              Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Credentials & Preferences
          </h1>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 mb-6 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Badges Showcase */}
      <div className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] mb-8 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Earned Student Badges
        </h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200/80 text-amber-800 shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="p-8 sm:p-10 rounded-[32px] glass-card-light border border-white/90 shadow-[0_12px_40px_rgba(37,99,235,0.06)] space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Bio / Aspirations</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. Preparing for JEE 2026. Interested in AI & Quantum Computing."
            className="w-full bg-white/90 border border-slate-200/90 rounded-2xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        {/* Academic Marks */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Class 10th Board Score (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={tenth}
              onChange={(e) => setTenth(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g. 95.5"
              className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Class 12th Board Score (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={twelfth}
              onChange={(e) => setTwelfth(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g. 93.8"
              className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Quotas & Home State */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            >
              <option value="General">General</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Home State</label>
            <input
              type="text"
              value={homeState}
              onChange={(e) => setHomeState(e.target.value)}
              placeholder="e.g. Maharashtra"
              className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Max Tuition Budget (INR)</label>
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g. 1500000"
              className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Preferred Exams & Branches */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Target Exams (Comma-separated)
          </label>
          <input
            type="text"
            value={preferredExams}
            onChange={(e) => setPreferredExams(e.target.value)}
            className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Preferred Branches (Comma-separated)
          </label>
          <input
            type="text"
            value={preferredBranches}
            onChange={(e) => setPreferredBranches(e.target.value)}
            className="w-full bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
        </button>
      </form>
    </div>
  );
}
