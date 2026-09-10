import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        helpfulCount: { increment: 1 },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Review vote error:", error);
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
  }
}
