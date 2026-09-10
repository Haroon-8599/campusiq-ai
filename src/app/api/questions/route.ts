import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");

    const questions = await prisma.question.findMany({
      where: tag ? { tags: { has: tag } } : {},
      include: {
        user: { select: { name: true, avatar: true } },
        college: { select: { name: true, shortName: true, slug: true } },
        answers: {
          include: {
            user: { select: { name: true, avatar: true, role: true } },
          },
          orderBy: [{ isAccepted: "desc" }, { upvotes: "desc" }],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Questions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

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
    const { title, content, tags = [], collegeId } = body;

    const question = await prisma.question.create({
      data: {
        userId: user.id,
        collegeId: collegeId || null,
        title,
        content,
        tags,
      },
      include: {
        user: { select: { name: true, avatar: true } },
        college: { select: { name: true, shortName: true, slug: true } },
        answers: true,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Question POST error:", error);
    return NextResponse.json({ error: "Failed to post question" }, { status: 500 });
  }
}
