"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  MapPin,
  X,
  Building2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeBasic } from "@/types";
import { cn, formatINR, formatLPA } from "@/lib/utils";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [collegeType, setCollegeType] = useState(searchParams.get("collegeType") || "");
  const [ownership, setOwnership] = useState(searchParams.get("ownership") || "");
  const [course, setCourse] = useState(searchParams.get("course") || "");
  const [maxFees, setMaxFees] = useState(parseInt(searchParams.get("maxFees") || "2000000", 10));
  const [minAvgPackage, setMinAvgPackage] = useState(parseInt(searchParams.get("minAvgPackage") || "0", 10));
  const [minRating, setMinRating] = useState(parseFloat(searchParams.get("minRating") || "0"));
  const [nirfTier, setNirfTier] = useState(searchParams.get("nirfTier") || "");
  const [hostelOnly, setHostelOnly] = useState(searchParams.get("hostelOnly") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "nirf");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [colleges, setColleges] = useState<CollegeBasic[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mapPreviewOpen, setMapPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (state) params.set("state", state);
      if (collegeType) params.set("collegeType", collegeType);
      if (ownership) params.set("ownership", ownership);
      if (course) params.set("course", course);
      if (maxFees < 2000000) params.set("maxFees", maxFees.toString());
      if (minAvgPackage > 0) params.set("minAvgPackage", minAvgPackage.toString());
      if (minRating > 0) params.set("minRating", minRating.toString());
      if (nirfTier) params.set("nirfTier", nirfTier);
      if (hostelOnly) params.set("hostelOnly", "true");
      params.set("sortBy", sortBy);
      params.set("page", page.toString());
      params.set("limit", "12");

      router.replace(`/search?${params.toString()}`, { scroll: false });

      try {
        const res = await fetch(`/api/colleges?${params.toString()}`);
        const data = await res.json();
        setColleges(data.colleges || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchColleges, 250);
    return () => clearTimeout(timer);
  }, [
    query,
    state,
    collegeType,
    ownership,
    course,
    maxFees,
    minAvgPackage,
    minRating,
    nirfTier,
    hostelOnly,
    sortBy,
    page,
  ]);

  const handleResetFilters = () => {
    setQuery("");
    setState("");
    setCollegeType("");
    setOwnership("");
    setCourse("");
    setMaxFees(2000000);
    setMinAvgPackage(0);
    setMinRating(0);
    setNirfTier("");
    setHostelOnly(false);
    setSortBy("nirf");
    setPage(1);
  };

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
  ];

  const collegeTypesList = ["IIT", "NIT", "IIIT", "BITS", "State", "Private", "Central"];

  // Determine active filter badges
  const activeFilters = [
    collegeType ? { label: `Tier: ${collegeType}`, onClear: () => setCollegeType("") } : null,
    state ? { label: `State: ${state}`, onClear: () => setState("") } : null,
    nirfTier ? { label: `NIRF: ${nirfTier.toUpperCase()}`, onClear: () => setNirfTier("") } : null,
    ownership ? { label: `Ownership: ${ownership}`, onClear: () => setOwnership("") } : null,
    minAvgPackage > 0 ? { label: `CTC ≥ ${minAvgPackage}L`, onClear: () => setMinAvgPackage(0) } : null,
    maxFees < 2000000 ? { label: `Fees ≤ ₹${(maxFees/100000).toFixed(1)}L`, onClear: () => setMaxFees(2000000) } : null,
    hostelOnly ? { label: "Hostel Required", onClear: () => setHostelOnly(false) } : null,
  ].filter(Boolean) as { label: string; onClear: () => void }[];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4">
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              COLLEGE EXPLORER
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">
              {totalCount.toLocaleString()} Verified Institutions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore & Compare Colleges
          </h1>
        </div>

        {/* Search Bar & View Toggles */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, city, or branch..."
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
            />
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Applied Filter Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-white/70 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 mr-1">Active Filters:</span>
          {activeFilters.map((af) => (
            <span
              key={af.label}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
            >
              <span>{af.label}</span>
              <button onClick={af.onClear} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 ml-2 underline"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden md:block col-span-1 space-y-6">
          <div className="p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                Refine Search
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* College Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Institution Tier
              </label>
              <div className="flex flex-wrap gap-1.5">
                {collegeTypesList.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setCollegeType(collegeType === t ? "" : t);
                      setPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-bold border transition-all",
                      collegeType === t
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Location (State)</label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="">All Indian States</option>
                {statesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* NIRF Ranking Tier */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                NIRF Rank Bracket
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Top 50", val: "top50" },
                  { label: "Top 100", val: "top100" },
                  { label: "Top 200", val: "top200" },
                  { label: "All Ranks", val: "" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setNirfTier(item.val);
                      setPage(1);
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition-all",
                      nirfTier === item.val
                        ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Average CTC Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700">Min. Average CTC</span>
                <span className="font-extrabold text-emerald-700">
                  {minAvgPackage > 0 ? `≥ ${formatLPA(minAvgPackage)}` : "Any CTC"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="2"
                value={minAvgPackage}
                onChange={(e) => {
                  setMinAvgPackage(parseInt(e.target.value, 10));
                  setPage(1);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Max Annual Tuition Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700">Max Annual Tuition</span>
                <span className="font-bold text-slate-800">
                  {maxFees < 2000000 ? formatINR(maxFees) : "No Limit"}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="50000"
                value={maxFees}
                onChange={(e) => {
                  setMaxFees(parseInt(e.target.value, 10));
                  setPage(1);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Ownership */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Ownership</label>
              <div className="grid grid-cols-2 gap-2">
                {["Public", "Private"].map((own) => (
                  <button
                    key={own}
                    onClick={() => {
                      setOwnership(ownership === own ? "" : own);
                      setPage(1);
                    }}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-bold border text-center transition-all",
                      ownership === own
                        ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {own}
                  </button>
                ))}
              </div>
            </div>

            {/* Hostel Available Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-100">
              <input
                type="checkbox"
                checked={hostelOnly}
                onChange={(e) => {
                  setHostelOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">Hostel Facility Mandatory</span>
            </label>
          </div>
        </aside>

        {/* Right College Results Grid */}
        <main className="col-span-1 md:col-span-3 space-y-6">
          {/* Controls Bar: Sort, View Toggle, Map Preview */}
          <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xs gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing page <span className="font-bold text-slate-900">{page}</span> of{" "}
              <span className="font-bold text-slate-900">{totalPages}</span>
            </span>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    viewMode === "grid" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    viewMode === "compact" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                  )}
                  title="Compact View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Map Preview Button */}
              <button
                onClick={() => setMapPreviewOpen(!mapPreviewOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{mapPreviewOpen ? "Hide Map" : "Map Preview"}</span>
              </button>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="nirf">NIRF Ranking (Ascending)</option>
                <option value="package">Average CTC (Highest First)</option>
                <option value="fees">Tuition Fees (Lowest First)</option>
                <option value="rating">Student Rating (Highest First)</option>
              </select>
            </div>
          </div>

          {/* Map Preview Interactive Mock Bar */}
          {mapPreviewOpen && (
            <div className="p-6 rounded-[28px] bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 shadow-xs animate-in fade-in space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Geographic Hub Preview</h4>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                  22 States Active
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Interactive spatial view clusters top campuses across Delhi NCR, Mumbai-Pune Tech Corridor, Bengaluru Silicon Cluster, and Chennai Engineering Belt.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-[28px] bg-white/60 border border-slate-200/80 animate-pulse p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-24 h-4 bg-slate-200 rounded-full" />
                    <div className="w-full h-6 bg-slate-200 rounded-xl" />
                    <div className="w-32 h-3 bg-slate-100 rounded-full" />
                  </div>
                  <div className="w-full h-16 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Results Grid / Compact Layout */}
          {!loading && colleges.length > 0 && (
            <div
              className={cn(
                "grid gap-5",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {colleges.map((col) =>
                viewMode === "grid" ? (
                  <CollegeCard key={col.id} college={col} />
                ) : (
                  <div
                    key={col.id}
                    className="p-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                        {col.shortName.slice(0, 3)}
                      </div>
                      <div>
                        <Link
                          href={`/college/${col.slug}`}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {col.name}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {col.city?.name}, {col.state?.name} • {col.collegeType} • NIRF #{col.nirfRank || "Top Tier"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Average CTC</span>
                        <span className="text-xs font-bold text-emerald-700">{formatLPA(col.avgPackageLpa)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Tuition Fees</span>
                        <span className="text-xs font-bold text-slate-800">{formatINR(col.feesMin)}</span>
                      </div>
                      <Link
                        href={`/college/${col.slug}`}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && colleges.length === 0 && (
            <div className="p-12 text-center rounded-[28px] bg-white/80 border border-slate-200 max-w-lg mx-auto shadow-xs">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">No matching institutions found</h3>
              <p className="text-xs text-slate-600 mb-6">
                Try widening your fee limits, lowering minimum CTC filters, or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 px-4 py-1">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40 backdrop-blur-sm md:hidden">
          <div className="w-full max-h-[85vh] overflow-y-auto bg-white border-t border-slate-200 rounded-t-[32px] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Filter Colleges</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Location (State)</label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="">All Indian States</option>
                {statesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 text-center text-xs text-slate-500">
          Loading College Explorer...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
