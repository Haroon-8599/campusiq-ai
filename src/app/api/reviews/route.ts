import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
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
      collegeId,
      rating,
      academicRating,
      infrastructureRating,
      campusLifeRating,
      placementRating,
      title,
      pros,
      cons,
    } = body;

    const review = await prisma.review.create({
      data: {
        collegeId,
        userId: user.id,
        rating: Number(rating) || 4,
        academicRating: Number(academicRating) || 4,
        infrastructureRating: Number(infrastructureRating) || 4,
        campusLifeRating: Number(campusLifeRating) || 4,
        placementRating: Number(placementRating) || 4,
        title,
        pros,
        cons: cons || "",
        verified: true,
      },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    // Update college review count
    await prisma.college.update({
      where: { id: collegeId },
      data: {
        reviewCount: { increment: 1 },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}
