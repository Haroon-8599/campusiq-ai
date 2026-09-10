import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email || "student@campusiq.ai";

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        bookmarks: {
          include: {
            college: {
              include: { state: true, city: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Top recommended colleges based on user's profile and top NIRF
    const recommendations = await prisma.college.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        state: true,
        city: true,
      },
      take: 6,
    });

    // Calculate profile completion score
    let completionScore = 40;
    if (user.profile) {
      if (user.profile.tenthPercentage) completionScore += 15;
      if (user.profile.twelfthPercentage) completionScore += 15;
      if (user.profile.homeState) completionScore += 10;
      if (user.profile.preferredExams.length > 0) completionScore += 10;
      if (user.profile.preferredBranches.length > 0) completionScore += 10;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        graduationYear: user.graduationYear,
        profile: user.profile,
      },
      savedCount: user.bookmarks.length,
      bookmarks: user.bookmarks,
      recommendations,
      completionScore: Math.min(100, completionScore),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
