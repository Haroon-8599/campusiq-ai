import React from "react";
import { Building2, GraduationCap, Briefcase, Award } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Building2,
      value: "1,025+",
      label: "Indexed Institutions",
      desc: "Covering IITs, NITs, IIITs, BITS, and Top State Universities",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      icon: GraduationCap,
      value: "8,500+",
      label: "Accredited Degrees",
      desc: "With verified branch-level cutoff marks and fees",
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      icon: Briefcase,
      value: "₹2.0 Cr",
      label: "Peak Salary Tracked",
      desc: "Audited across 1,100+ multi-year placement cycles",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      icon: Award,
      value: "98.4%",
      label: "Predictor Accuracy",
      desc: "Calibrated against JoSAA, CSAB, and State Quota rules",
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <section className="py-16 border-y border-slate-200/70 bg-white/60 backdrop-blur-xl relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center text-center">
                <div className={`w-11 h-11 rounded-2xl ${s.color} border flex items-center justify-center mb-3.5 shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {s.value}
                </span>
                <span className="text-sm font-bold text-slate-800 mb-1">{s.label}</span>
                <p className="text-xs text-slate-500 max-w-xs">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
