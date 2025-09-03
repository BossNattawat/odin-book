import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const replies = await prisma.comment.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePic: true
          },
        },
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profilePic: true
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ replies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user replies:", error);
    return NextResponse.json({ error: "Failed to get user replies" }, { status: 500 });
  }
}
