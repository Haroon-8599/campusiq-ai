import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const [totalColleges, totalReviews, totalQuestions, totalUsers] = await Promise.all([
      prisma.college.count(),
      prisma.review.count(),
      prisma.question.count(),
      prisma.user.count(),
    ]);

    const recentReviews = await prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        college: { select: { name: true, shortName: true } },
        user: { select: { name: true } },
      },
    });

    const recentQuestions = await prisma.question.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({
      stats: {
        totalColleges,
        totalReviews,
        totalQuestions,
        totalUsers,
      },
      recentReviews,
      recentQuestions,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
