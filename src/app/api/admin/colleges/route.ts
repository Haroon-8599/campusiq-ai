import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const skip = (page - 1) * limit;

    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { shortName: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        include: {
          state: true,
          city: true,
        },
        orderBy: { nirfRank: "asc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin colleges error:", error);
    return NextResponse.json({ error: "Failed to fetch colleges for admin" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, shortName, slug, collegeType, ownership, stateId, cityId, nirfRank, avgPackageLpa, feesMin, feesMax, overview } = body;

    const created = await prisma.college.create({
      data: {
        name,
        shortName,
        slug,
        collegeType,
        ownership,
        stateId,
        cityId,
        nirfRank: nirfRank ? Number(nirfRank) : null,
        avgPackageLpa: Number(avgPackageLpa) || 10,
        highestPackageLpa: Number(avgPackageLpa || 10) * 2,
        feesMin: Number(feesMin) || 100000,
        feesMax: Number(feesMax) || 150000,
        establishedYear: 2000,
        address: `${cityId}, ${stateId}`,
        overview: overview || `${name} is an accredited engineering institution.`,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Admin college create error:", error);
    return NextResponse.json({ error: "Failed to create college" }, { status: 500 });
  }
}
