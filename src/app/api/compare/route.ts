import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ colleges: [] });
    }

    const ids = idsParam.split(",").filter(Boolean);

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        state: true,
        city: true,
        courses: {
          take: 6,
          orderBy: { cutoffGeneral: "asc" },
        },
        placements: {
          orderBy: { year: "desc" },
          take: 3,
        },
        recruiters: {
          include: {
            recruiter: true,
          },
          take: 8,
        },
      },
    });

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Compare API error:", error);
    return NextResponse.json({ error: "Failed to compare colleges" }, { status: 500 });
  }
}
