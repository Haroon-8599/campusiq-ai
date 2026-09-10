import { prisma } from "@/lib/prisma";
import { PredictorInput, PredictorResult } from "@/types";

export async function runAdmissionPredictor(input: PredictorInput): Promise<{
  safe: PredictorResult[];
  target: PredictorResult[];
  dream: PredictorResult[];
  totalEvaluated: number;
}> {
  const { exam, rank, category, homeState, budget, preferredBranch } = input;

  // Query courses with entrance exam matching, along with college details
  const courses = await prisma.course.findMany({
    where: {
      entranceExam: {
        contains: exam,
        mode: "insensitive",
      },
      ...(preferredBranch
        ? {
            branch: {
              contains: preferredBranch,
              mode: "insensitive",
            },
          }
        : {}),
      ...(budget
        ? {
            annualTuition: {
              lte: budget,
            },
          }
        : {}),
    },
    include: {
      college: {
        include: {
          state: true,
          city: true,
        },
      },
    },
    take: 400,
  });

  const safeResults: PredictorResult[] = [];
  const targetResults: PredictorResult[] = [];
  const dreamResults: PredictorResult[] = [];

  for (const course of courses) {
    const college = course.college;

    // Determine baseline category cutoff
    let baseCutoff = course.cutoffGeneral || 25000;
    if (category === "OBC" || category === "OBC-NCL") {
      baseCutoff = course.cutoffObc || Math.floor(baseCutoff * 1.3);
    } else if (category === "SC") {
      baseCutoff = course.cutoffSc || Math.floor(baseCutoff * 2.2);
    } else if (category === "ST") {
      baseCutoff = course.cutoffSt || Math.floor(baseCutoff * 3.5);
    } else if (category === "EWS") {
      baseCutoff = Math.floor(baseCutoff * 1.15);
    }

    // Home State quota bonus for NITs and State institutions
    let quotaBonus = 1.0;
    const isHomeState = college.state.name.toLowerCase() === homeState.toLowerCase();
    if (isHomeState && (college.collegeType === "NIT" || college.collegeType === "State")) {
      quotaBonus = 1.25; // 25% rank relaxation due to 50% state quota
    }

    const effectiveCutoff = Math.floor(baseCutoff * quotaBonus);
    const ratio = effectiveCutoff / Math.max(1, rank);

    let tier: "Safe" | "Target" | "Dream" | null = null;
    let probability = 0;
    let confidence = 85;
    const matchReasons: string[] = [];

    if (ratio >= 1.25) {
      tier = "Safe";
      probability = Math.min(98, Math.round(75 + (ratio - 1.25) * 15));
      confidence = 94;
      matchReasons.push(`Your rank #${rank} is comfortably within historical closing cutoff #${effectiveCutoff}`);
      if (isHomeState) {
        matchReasons.push(`Benefitting from ${homeState} Home State reservation advantage`);
      }
      matchReasons.push(`Robust ${college.placementRate}% placement rate with ₹${college.avgPackageLpa} LPA average CTC`);
    } else if (ratio >= 0.85 && ratio < 1.25) {
      tier = "Target";
      probability = Math.min(74, Math.round(45 + (ratio - 0.85) * 72));
      confidence = 88;
      matchReasons.push(`Competitive cutoff zone: closing rank aligns closely with candidate percentile`);
      matchReasons.push(`Strong academic reputation (NIRF #${college.nirfRank || "Top Tier"})`);
      if (budget && course.annualTuition <= budget) {
        matchReasons.push(`Tuition fee of ₹${(course.annualTuition / 100000).toFixed(1)}L meets your budget`);
      }
    } else if (ratio >= 0.45 && ratio < 0.85) {
      tier = "Dream";
      probability = Math.min(44, Math.round(15 + (ratio - 0.45) * 70));
      confidence = 78;
      matchReasons.push(`Ambitious reach: closing cutoff is highly selective (#${effectiveCutoff})`);
      matchReasons.push(`Flagship Tier-1 recruiters visiting campus (₹${college.highestPackageLpa} LPA highest package)`);
    }

    if (!tier) continue;

    const decisionSummary = `${college.shortName} (${course.name}) is classified as a ${tier.toUpperCase()} choice. With your rank of ${rank.toLocaleString()} against the estimated closing cutoff of ${effectiveCutoff.toLocaleString()}${isHomeState ? ` (including ${homeState} home quota)` : ""}, your admission probability is approximately ${probability}%.`;

    const item: PredictorResult = {
      college: {
        id: college.id,
        slug: college.slug,
        name: college.name,
        shortName: college.shortName,
        collegeType: college.collegeType,
        ownership: college.ownership,
        establishedYear: college.establishedYear,
        campusSizeAcres: college.campusSizeAcres,
        hostelAvailable: college.hostelAvailable,
        nirfRank: college.nirfRank,
        naacRating: college.naacRating,
        overallRating: college.overallRating,
        reviewCount: college.reviewCount,
        feesMin: college.feesMin,
        feesMax: college.feesMax,
        avgPackageLpa: college.avgPackageLpa,
        highestPackageLpa: college.highestPackageLpa,
        placementRate: college.placementRate,
        address: college.address,
        website: college.website,
        logoUrl: college.logoUrl,
        bannerUrl: college.bannerUrl,
        overview: college.overview,
        isFeatured: college.isFeatured,
        state: college.state,
        city: college.city,
      },
      course: {
        id: course.id,
        name: course.name,
        degree: course.degree,
        branch: course.branch,
        durationYears: course.durationYears,
        annualTuition: course.annualTuition,
        seats: course.seats,
        cutoffGeneral: course.cutoffGeneral,
        cutoffObc: course.cutoffObc,
        cutoffSc: course.cutoffSc,
        cutoffSt: course.cutoffSt,
        entranceExam: course.entranceExam,
      },
      probability,
      tier,
      confidenceScore: confidence,
      matchReasons,
      decisionSummary,
    };

    if (tier === "Safe") safeResults.push(item);
    else if (tier === "Target") targetResults.push(item);
    else if (tier === "Dream") dreamResults.push(item);
  }

  // Sort by probability descending
  safeResults.sort((a, b) => b.probability - a.probability);
  targetResults.sort((a, b) => b.probability - a.probability);
  dreamResults.sort((a, b) => b.probability - a.probability);

  return {
    safe: safeResults.slice(0, 15),
    target: targetResults.slice(0, 15),
    dream: dreamResults.slice(0, 15),
    totalEvaluated: courses.length,
  };
}
