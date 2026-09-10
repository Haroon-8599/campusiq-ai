"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  MessageSquare,
  Star,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  X,
} from "lucide-react";
import { formatLPA, formatINR } from "@/lib/utils";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // New college modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");
  const [newType, setNewType] = useState("Private");
  const [newAvgPkg, setNewAvgPkg] = useState("12");
  const [newNirf, setNewNirf] = useState("");

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setStats(json);
    } catch (err) {
      console.error(err);
    }
  };

  const loadColleges = async () => {
    try {
      const res = await fetch(`/api/admin/colleges?query=${encodeURIComponent(query)}&page=${page}`);
      const json = await res.json();
      setColleges(json.colleges || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadStats(), loadColleges()]);
      setLoading(false);
    }
    init();
  }, [query, page]);

  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newShortName.trim()) return;

    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          shortName: newShortName,
          slug,
          collegeType: newType,
          ownership: newType === "Private" ? "Private" : "Public",
          avgPackageLpa: Number(newAvgPkg),
          nirfRank: newNirf ? Number(newNirf) : null,
          stateId: "Delhi",
          cityId: "New Delhi",
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewName("");
        setNewShortName("");
        setNewNirf("");
        loadColleges();
        loadStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-medium text-slate-500">Loading admin console...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              CAMPUSIQ ADMIN PANEL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Oversight & Database Management
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New College</span>
        </button>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-[24px] glass-card-light border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Colleges</span>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.stats?.totalColleges?.toLocaleString()}</span>
        </div>
        <div className="p-6 rounded-[24px] glass-card-light border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Verified Reviews</span>
          <span className="text-3xl font-extrabold text-amber-500">{stats?.stats?.totalReviews?.toLocaleString()}</span>
        </div>
        <div className="p-6 rounded-[24px] glass-card-light border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Community Inquiries</span>
          <span className="text-3xl font-extrabold text-blue-600">{stats?.stats?.totalQuestions?.toLocaleString()}</span>
        </div>
        <div className="p-6 rounded-[24px] glass-card-light border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Registered Users</span>
          <span className="text-3xl font-extrabold text-emerald-600">{stats?.stats?.totalUsers?.toLocaleString()}</span>
        </div>
      </div>

      {/* Colleges Management Table */}
      <div className="p-6 sm:p-8 rounded-[32px] glass-card-light border border-white/90 shadow-[0_10px_35px_rgba(37,99,235,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900">Manage Directory ({stats?.stats?.totalColleges} total)</h3>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search colleges..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">NIRF</th>
                <th className="p-3.5">Avg CTC</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {colleges.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {c.name}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {c.city?.name}, {c.state?.name}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium">{c.collegeType}</td>
                  <td className="p-3.5 font-extrabold text-blue-600">{c.nirfRank ? `#${c.nirfRank}` : "—"}</td>
                  <td className="p-3.5 font-bold text-emerald-600">{formatLPA(c.avgPackageLpa)}</td>
                  <td className="p-3.5 text-amber-500 font-bold">★ {c.overallRating.toFixed(1)}</td>
                  <td className="p-3.5 text-right">
                    <a
                      href={`/college/${c.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <form
            onSubmit={handleCreateCollege}
            className="w-full max-w-md bg-white border border-white/90 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New College Record</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Apex Institute of Technology"
                className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Short Name</label>
              <input
                type="text"
                required
                value={newShortName}
                onChange={(e) => setNewShortName(e.target.value)}
                placeholder="e.g. AIT Delhi"
                className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">College Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                >
                  <option value="IIT">IIT</option>
                  <option value="NIT">NIT</option>
                  <option value="IIIT">IIIT</option>
                  <option value="BITS">BITS</option>
                  <option value="Private">Private</option>
                  <option value="State">State</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Avg CTC (LPA)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newAvgPkg}
                  onChange={(e) => setNewAvgPkg(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">NIRF Rank (Optional)</label>
              <input
                type="number"
                value={newNirf}
                onChange={(e) => setNewNirf(e.target.value)}
                placeholder="e.g. 45"
                className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Save & Publish College
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
