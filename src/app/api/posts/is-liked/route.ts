/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const postID = searchParams.get("postID");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    if (!postID) {
      return NextResponse.json({ error: "PostID is required" }, { status: 400 });
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the like for the specific post and user
    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: postID,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!like) {
      return NextResponse.json({ liked: false }, { status: 200 });
    }

    return NextResponse.json({ liked: true, post: like.post }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
