import React from "react";
import { Cpu, Target, ShieldCheck, Scale } from "lucide-react";

export function WhyCampusIQ() {
  const cards = [
    {
      icon: Cpu,
      title: "Deterministic Admission Scoring",
      description:
        "Transparent rank-to-cutoff calculations incorporating reservation quotas, category multipliers, and 50% home state advantages.",
      border: "hover:border-blue-300",
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      icon: Target,
      title: "Verified Placement Auditing",
      description:
        "We audit CTC packages, distinguishing median packages from inflated claims across 2022-2024 hiring cycles.",
      border: "hover:border-sky-300",
      iconColor: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      icon: Scale,
      title: "Interactive 3-Way College Radar",
      description:
        "Compare up to 3 colleges side by side across ROI, faculty-student ratios, campus infrastructure, and batch placement rates.",
      border: "hover:border-purple-300",
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      icon: ShieldCheck,
      title: "Zero Sponsored Bias",
      description:
        "No sponsored listings or private university push. CampusIQ AI provides objective, data-backed recommendations.",
      border: "hover:border-emerald-300",
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          WHY CHOOSE CAMPUSIQ AI
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Engineered for Students, Not Advertisers.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className={`p-7 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] ${c.border} hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${c.iconColor} border flex items-center justify-center mb-5 shadow-xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 tracking-tight">{c.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{c.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
