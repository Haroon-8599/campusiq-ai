"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ScoreGauge({
  score,
  maxScore = 100,
  size = 110,
  strokeWidth = 8,
  label,
  sublabel,
  className,
}: ScoreGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 85) return { stroke: "#10b981", glow: "rgba(16, 185, 129, 0.25)", text: "text-emerald-600" };
    if (pct >= 70) return { stroke: "#2563eb", glow: "rgba(37, 99, 235, 0.25)", text: "text-blue-600" };
    if (pct >= 50) return { stroke: "#8b5cf6", glow: "rgba(139, 92, 246, 0.25)", text: "text-purple-600" };
    return { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.25)", text: "text-amber-600" };
  };

  const { stroke, glow, text } = getColor(percentage);

  return (
    <div className={cn("flex flex-col items-center justify-center relative", className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Light background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${glow})`,
              transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn("text-xl font-extrabold tracking-tight", text)}>
            {maxScore === 5 ? score.toFixed(1) : `${Math.round(score)}%`}
          </span>
          {sublabel && <span className="text-[10px] uppercase font-bold text-slate-400">{sublabel}</span>}
        </div>
      </div>
      {label && <p className="mt-2 text-xs font-semibold text-slate-700 text-center">{label}</p>}
    </div>
  );
}
