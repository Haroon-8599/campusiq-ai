import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email || "student@campusiq.ai";

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        graduationYear: user.graduationYear,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email || "student@campusiq.ai";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      bio,
      graduationYear,
      tenthPercentage,
      twelfthPercentage,
      category,
      gender,
      homeState,
      budgetMax,
      preferredExams,
      preferredBranches,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        bio: bio !== undefined ? bio : user.bio,
        graduationYear: graduationYear ? Number(graduationYear) : user.graduationYear,
        profile: {
          upsert: {
            create: {
              tenthPercentage: tenthPercentage ? Number(tenthPercentage) : null,
              twelfthPercentage: twelfthPercentage ? Number(twelfthPercentage) : null,
              category: category || "General",
              gender: gender || "All",
              homeState: homeState || "Maharashtra",
              budgetMax: budgetMax ? Number(budgetMax) : 1500000,
              preferredExams: preferredExams || ["JEE Main"],
              preferredBranches: preferredBranches || ["Computer Science and Engineering"],
            },
            update: {
              tenthPercentage: tenthPercentage ? Number(tenthPercentage) : null,
              twelfthPercentage: twelfthPercentage ? Number(twelfthPercentage) : null,
              category: category || undefined,
              gender: gender || undefined,
              homeState: homeState || undefined,
              budgetMax: budgetMax ? Number(budgetMax) : undefined,
              preferredExams: preferredExams || undefined,
              preferredBranches: preferredBranches || undefined,
            },
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
