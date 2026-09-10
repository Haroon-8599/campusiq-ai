import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BookmarkCollection } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    // Default to student test account if browsing in guest mode for assignment demonstration
    const email = session?.user?.email || "student@campusiq.ai";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        college: {
          include: {
            state: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Bookmarks GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
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
    const { collegeId, collection = "SHORTLISTED", notes } = body;

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId,
        },
      },
      update: {
        collection: collection as BookmarkCollection,
        notes,
      },
      create: {
        userId: user.id,
        collegeId,
        collection: collection as BookmarkCollection,
        notes,
      },
    });

    return NextResponse.json({ bookmark });
  } catch (error) {
    console.error("Bookmarks POST error:", error);
    return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email || "student@campusiq.ai";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: user.id,
        collegeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bookmarks DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
