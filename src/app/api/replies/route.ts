/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { content, postId, username } = await req.json();

    if (!content || !postId || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const authorId = await prisma.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    })

    if(!authorId) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: authorId.id
      }
    });

    // Increment comment count on the post
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentCount: { increment: 1 }
      }
    });

    return NextResponse.json({ message: "Reply created", comment }, { status: 201 });
  } catch (error) {
    console.error("Reply creation error:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postID = searchParams.get("postID");

    if (!postID) {
      return NextResponse.json({ error: "postID is required" }, { status: 400 });
    }

    const replies = await prisma.comment.findMany({
      where: {
        postId: postID,
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

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}