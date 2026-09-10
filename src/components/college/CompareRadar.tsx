"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { CollegeBasic } from "@/types";

interface CompareRadarProps {
  colleges: CollegeBasic[];
}

export function CompareRadar({ colleges }: CompareRadarProps) {
  if (!colleges || colleges.length === 0) return null;

  const colors = ["#2563eb", "#10b981", "#8b5cf6"];

  const metrics = [
    { subject: "Academics", key: "academics" },
    { subject: "Placements", key: "placements" },
    { subject: "Infrastructure", key: "infra" },
    { subject: "ROI Value", key: "roi" },
    { subject: "Campus Life", key: "life" },
    { subject: "Brand Equity", key: "brand" },
  ];

  const radarData = metrics.map((m) => {
    const row: any = { subject: m.subject };
    colleges.forEach((col, idx) => {
      let val = 70;
      if (m.key === "academics") {
        val = Math.min(100, Math.round((col.overallRating / 5) * 100));
      } else if (m.key === "placements") {
        val = Math.min(100, Math.round((col.avgPackageLpa / 25) * 100));
      } else if (m.key === "infra") {
        val = Math.min(100, Math.round(50 + (col.campusSizeAcres / 600) * 50));
      } else if (m.key === "roi") {
        const ratio = (col.avgPackageLpa * 100000) / Math.max(1, col.feesMin);
        val = Math.min(100, Math.round(ratio * 12));
      } else if (m.key === "life") {
        val = Math.min(100, Math.round(col.overallRating * 19));
      } else if (m.key === "brand") {
        val = col.nirfRank ? Math.max(40, 105 - col.nirfRank) : 60;
      }
      row[`col_${idx}`] = val;
    });
    return row;
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
          <PolarGrid stroke="rgba(0, 0, 0, 0.07)" />
          <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11} fontWeight={600} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "1rem",
              fontSize: "12px",
              color: "#0f172a",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
          />
          {colleges.map((col, idx) => (
            <Radar
              key={col.id}
              name={col.shortName}
              dataKey={`col_${idx}`}
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "12px",
              fontWeight: 600,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
