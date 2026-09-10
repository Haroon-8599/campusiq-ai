import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        state: true,
        city: true,
        courses: {
          orderBy: { cutoffGeneral: "asc" },
        },
        placements: {
          orderBy: { year: "desc" },
        },
        recruiters: {
          include: {
            recruiter: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { helpfulCount: "desc" },
        },
        scholarships: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Fetch similar colleges based on type and ranking range
    const similarColleges = await prisma.college.findMany({
      where: {
        id: { not: college.id },
        collegeType: college.collegeType,
      },
      include: {
        state: true,
        city: true,
      },
      take: 4,
    });

    return NextResponse.json({
      college,
      similarColleges,
    });
  } catch (error) {
    console.error("College detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch college details" }, { status: 500 });
  }
}
