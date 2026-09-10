import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (!amount && amount !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLPA(lpa: number): string {
  if (!lpa && lpa !== 0) return "N/A";
  return `₹${lpa.toFixed(1)} LPA`;
}

export function formatNumber(num: number): string {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function getScoreColor(score: number): { text: string; bg: string; border: string; glow: string } {
  if (score >= 90) {
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    };
  }
  if (score >= 75) {
    return {
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    };
  }
  if (score >= 60) {
    return {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    };
  }
  return {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  };
}
