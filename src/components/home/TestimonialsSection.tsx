import React from "react";
import { CheckCircle } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rohan Kulkarni",
      role: "Admitted to IIT Bombay CSE",
      quote:
        "The category-wise cutoff explainability is leagues ahead of other portals. Instead of false hopes, CampusIQ accurately classified IIT Bombay as Target and NIT Trichy as Safe for my score.",
      rating: 5,
      college: "IIT Bombay Batch of '28",
    },
    {
      name: "Ananya Iyer",
      role: "Admitted to BITS Pilani Dual Degree",
      quote:
        "The comparison radar opened my eyes to the actual ROI between BITS Goa CS vs NIT Surathkal ECE. The salary trend graph showed consistent Tier-1 visits regardless of hiring slowdowns.",
      rating: 5,
      college: "BITS Pilani Batch of '28",
    },
    {
      name: "Devendra Verma",
      role: "Admitted to DTU Software Engineering",
      quote:
        "The 50% Delhi home state quota logic correctly surfaced DTU SE when other sites showed generic All-India cutoffs that discouraged me from applying. Pure gold.",
      rating: 5,
      college: "DTU Delhi",
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
          STUDENT SUCCESS
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Trusted by Top 1% Rankers and Parents.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="p-7 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex text-amber-400 text-sm mb-4">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-sm text-slate-700 italic mb-6 leading-relaxed font-normal">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                {t.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{t.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[11px] font-semibold text-blue-600 block">{t.college}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
