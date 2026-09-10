import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const email = session?.user?.email || "student@campusiq.ai";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { content } = body;

    const answer = await prisma.answer.create({
      data: {
        questionId: id,
        userId: user.id,
        content,
      },
      include: {
        user: { select: { name: true, avatar: true, role: true } },
      },
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error("Answer creation error:", error);
    return NextResponse.json({ error: "Failed to post answer" }, { status: 500 });
  }
}
