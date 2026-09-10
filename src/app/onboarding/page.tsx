"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Check, Compass, Award, Shield } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Selections
  const [selectedExams, setSelectedExams] = useState<string[]>(["JEE Main"]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    "Computer Science and Engineering",
  ]);
  const [selectedStates, setSelectedStates] = useState<string[]>(["Delhi", "Maharashtra"]);
  const [budget, setBudget] = useState("1500000");
  const [category, setCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredExams: selectedExams,
          preferredBranches: selectedBranches,
          category,
          budgetMax: Number(budget),
        }),
      });

      if (typeof window !== "undefined") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  const exams = ["JEE Main", "JEE Advanced", "BITSAT", "GATE", "CAT", "NEET", "CUET"];
  const branches = [
    "Computer Science and Engineering",
    "Artificial Intelligence & Data Science",
    "Electronics and Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Biotechnology",
    "Business Analytics",
    "Data Science",
  ];
  const states = [
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "Rajasthan",
    "Uttar Pradesh",
    "Gujarat",
    "West Bengal",
  ];

  return (
    <div className="pt-32 pb-24 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Progress pill indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 font-extrabold text-xs shadow-xs">
            {step}/4
          </div>
          <span className="text-xs font-bold text-slate-700">
            {step === 1 && "Select Entrance Exams"}
            {step === 2 && "Choose Specializations"}
            {step === 3 && "Preferred Campus Hubs"}
            {step === 4 && "Budget & Category Setup"}
          </span>
        </div>

        {/* Step bars */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "w-9 h-2 rounded-full transition-all",
                i <= step ? "bg-blue-600 shadow-sm" : "bg-slate-200/80"
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-[32px] glass-card-light border border-white/90 shadow-[0_12px_40px_rgba(37,99,235,0.06)] space-y-6">
        {/* STEP 1: EXAMS */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Which entrance exams are you targeting?</h2>
            <p className="text-xs text-slate-500 font-medium">
              CampusIQ will calibrate college cutoff simulations based on these test formats.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {exams.map((ex) => {
                const selected = selectedExams.includes(ex);
                return (
                  <button
                    key={ex}
                    onClick={() => toggleItem(selectedExams, setSelectedExams, ex)}
                    className={cn(
                      "p-3.5 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between cursor-pointer",
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white/80 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300"
                    )}
                  >
                    <span>{ex}</span>
                    {selected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: BRANCHES */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Select your preferred degree branches</h2>
            <p className="text-xs text-slate-500 font-medium">
              We'll highlight matching faculty, average packages, and seats for these specializations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {branches.map((br) => {
                const selected = selectedBranches.includes(br);
                return (
                  <button
                    key={br}
                    onClick={() => toggleItem(selectedBranches, setSelectedBranches, br)}
                    className={cn(
                      "p-3.5 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between cursor-pointer",
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white/80 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300"
                    )}
                  >
                    <span className="truncate pr-2">{br}</span>
                    {selected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: STATES */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Preferred educational hubs & locations</h2>
            <p className="text-xs text-slate-500 font-medium">
              Select states you are open to studying in for undergrad or postgrad programs.
            </p>
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {states.map((st) => {
                const selected = selectedStates.includes(st);
                return (
                  <button
                    key={st}
                    onClick={() => toggleItem(selectedStates, setSelectedStates, st)}
                    className={cn(
                      "p-3.5 rounded-2xl text-xs font-bold border text-center transition-all cursor-pointer",
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white/80 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300"
                    )}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET & CATEGORY */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Counseling Category & Budget</h2>
            <p className="text-xs text-slate-500 font-medium">
              These inputs finalize your admission prediction model and JoSAA quota weights.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {["General", "OBC-NCL", "SC", "ST", "EWS"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer",
                      category === cat
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Maximum Annual Tuition Budget: ₹{(Number(budget) / 100000).toFixed(1)} Lakhs
              </label>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="100000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs transition-all"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={handleFinish}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? "Personalizing Feed..." : "Launch Dashboard"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
