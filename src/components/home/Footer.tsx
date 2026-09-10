import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-xl pt-16 pb-24 md:pb-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] shadow-xs">
                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </div>
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">CampusIQ</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold border border-blue-200">
                AI
              </span>
            </Link>
            <p className="text-xs text-slate-600 max-w-sm mb-4 leading-relaxed font-normal">
              The next-generation college discovery and predictive admissions platform. Providing
              transparent, multi-factor intelligence for students, parents, and counselors.
            </p>
            <div className="flex items-center gap-3 text-slate-600">
              <span className="text-[11px] text-emerald-700 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live: 1,025 Verified Colleges
              </span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Explore</h5>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/search" className="hover:text-blue-600 transition-colors">
                  College Search
                </Link>
              </li>
              <li>
                <Link href="/predictor" className="hover:text-blue-600 transition-colors">
                  AI Admission Predictor
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600 transition-colors">
                  Side-by-Side Compare
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-blue-600 transition-colors">
                  Student Community Q&A
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Colleges</h5>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/search?collegeType=IIT" className="hover:text-blue-600 transition-colors">
                  Top 23 IITs
                </Link>
              </li>
              <li>
                <Link href="/search?collegeType=NIT" className="hover:text-blue-600 transition-colors">
                  Top 31 NITs
                </Link>
              </li>
              <li>
                <Link href="/search?collegeType=IIIT" className="hover:text-blue-600 transition-colors">
                  Premier IIITs
                </Link>
              </li>
              <li>
                <Link href="/search?collegeType=BITS" className="hover:text-blue-600 transition-colors">
                  BITS Pilani Campuses
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Account */}
          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Portal</h5>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/auth/login" className="hover:text-blue-600 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-blue-600 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  Student Cockpit
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-normal">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} CampusIQ AI. Built with Aurora Glass Light design system.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-600 cursor-pointer">NIRF Methodology</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
