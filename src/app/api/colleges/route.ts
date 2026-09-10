import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const state = searchParams.get("state") || "";
    const city = searchParams.get("city") || "";
    const collegeType = searchParams.get("collegeType") || "";
    const ownership = searchParams.get("ownership") || "";
    const course = searchParams.get("course") || "";
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const maxFees = parseFloat(searchParams.get("maxFees") || "2000000");
    const minAvgPackage = parseFloat(searchParams.get("minAvgPackage") || "0");
    const exam = searchParams.get("exam") || "";
    const nirfTier = searchParams.get("nirfTier") || "";
    const hostelOnly = searchParams.get("hostelOnly") === "true";
    const sortBy = searchParams.get("sortBy") || "nirf";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { shortName: { contains: query, mode: "insensitive" } },
        { overview: { contains: query, mode: "insensitive" } },
        { city: { name: { contains: query, mode: "insensitive" } } },
        { state: { name: { contains: query, mode: "insensitive" } } },
      ];
    }

    if (state) {
      where.state = { name: { equals: state, mode: "insensitive" } };
    }

    if (city) {
      where.city = { name: { equals: city, mode: "insensitive" } };
    }

    if (collegeType) {
      where.collegeType = { equals: collegeType };
    }

    if (ownership) {
      where.ownership = { equals: ownership };
    }

    if (minRating > 0) {
      where.overallRating = { gte: minRating };
    }

    if (maxFees < 2000000) {
      where.feesMin = { lte: maxFees };
    }

    if (minAvgPackage > 0) {
      where.avgPackageLpa = { gte: minAvgPackage };
    }

    if (hostelOnly) {
      where.hostelAvailable = true;
    }

    if (nirfTier === "top50") {
      where.nirfRank = { lte: 50, not: null };
    } else if (nirfTier === "top100") {
      where.nirfRank = { lte: 100, not: null };
    } else if (nirfTier === "top200") {
      where.nirfRank = { lte: 200, not: null };
    }

    if (course || exam) {
      where.courses = {
        some: {
          ...(course ? { name: { contains: course, mode: "insensitive" } } : {}),
          ...(exam ? { entranceExam: { contains: exam, mode: "insensitive" } } : {}),
        },
      };
    }

    let orderBy: any = [{ nirfRank: "asc" }];

    if (sortBy === "package") {
      orderBy = [{ avgPackageLpa: "desc" }];
    } else if (sortBy === "fees") {
      orderBy = [{ feesMin: "asc" }];
    } else if (sortBy === "rating") {
      orderBy = [{ overallRating: "desc" }];
    } else if (sortBy === "nirf") {
      orderBy = [{ nirfRank: "asc" }, { avgPackageLpa: "desc" }];
    }

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        include: {
          state: true,
          city: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Colleges search API error:", error);
    return NextResponse.json({ error: "Failed to query colleges." }, { status: 500 });
  }
}
